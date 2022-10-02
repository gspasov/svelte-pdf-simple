<script lang="ts">
  import * as pdfjs from "pdfjs-dist";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import {
    type PdfLoadSuccess,
    type PdfPageContent,
    type PDFDocumentProxy,
    type PDFPageProxy,
    type TextContent,
    type Degrees,
    type PdfException,
    type Properties,
    PdfExceptionName,
  } from "./types";
  import { parseError } from "./utils";

  interface $$Slots {
    loading: Record<string, unknown>;
    password_required: Record<string, unknown>;
    loading_failed: Record<string, unknown>;
  }

  interface $$Events {
    password_required: CustomEvent<void>;
    incorrect_password: CustomEvent<void>;
    load_success: CustomEvent<PdfLoadSuccess>;
    load_failure: CustomEvent<PdfException>;
    page_changed: CustomEvent<PdfPageContent>;
  }

  export let props: Properties;

  export async function goToPage(pageNumber: number): Promise<void> {
    if (pageNumber > pdfDoc.numPages || pageNumber < 1) return;
    return renderPage(pdfDoc, pageNumber).then((pageContent): void => {
      dispatch("page_changed", pageContent);
    });
  }

  export async function resize(newScale: number): Promise<void> {
    return fillCanvas(pdfPage, newScale, _props.rotation, _props.offsetX, _props.offsetY);
  }

  export async function rotate(degrees: Degrees): Promise<void> {
    return fillCanvas(pdfPage, _props.scale, degrees, _props.offsetX, _props.offsetY);
  }

  export async function openWithPassword(password: string): Promise<void> {
    return loadPdf(password);
  }

  let canvas: HTMLCanvasElement;
  let pdfDoc: PDFDocumentProxy;
  let pdfPage: PDFPageProxy;
  let _props: Properties = {
    page: 1,
    scale: 1.0,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    withAnnotations: false,
    withTextContent: false,
    ...props,
  };
  $: isPdfLoading = true;
  $: isPdfLoadSuccess = false;
  $: isPdfLoadFailure = false;
  $: isPdfPageRenderSuccess = false;
  $: isPdfPasswordProtected = false;

  const dispatch = createEventDispatcher();

  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@2.13.216/legacy/build/pdf.worker.min.js";

  onMount(async () => {
    if (_props.url === undefined && _props.data === undefined && _props.path === undefined) {
      isPdfLoadFailure = true;
      console.warn("[svelte-pdf-simple] Missing pdf data source.");
    }
    await loadPdf();
  });

  function getPageRotation(pdfPageInfo: unknown): Degrees | null {
    const key = "rotate";
    if (
      typeof pdfPageInfo === "object" &&
      pdfPageInfo !== null &&
      Object.prototype.hasOwnProperty.call(pdfPageInfo, key) &&
      typeof pdfPageInfo[key] === "number"
    ) {
      return pdfPageInfo[key] as Degrees;
    }

    return null;
  }

  async function renderPage(doc: PDFDocumentProxy, pageNumber: number): Promise<PdfPageContent> {
    pdfPage = await doc.getPage(pageNumber);

    let annotations: Record<string, unknown>[];
    let textContent: TextContent;
    if (_props.withAnnotations) {
      annotations = await pdfPage.getAnnotations();
    }
    if (_props.withTextContent) {
      textContent = await pdfPage.getTextContent();
    }
    await fillCanvas(pdfPage, _props.scale, _props.rotation, _props.offsetX, _props.offsetY);

    const pageRotation = getPageRotation(pdfPage._pageInfo);
    return {
      ...(annotations != null && { annotations }),
      ...(textContent != null && { textContent }),
      ...(pageRotation != null && { pageRotation }),
      pageNumber,
    };
  }

  async function loadPdf(pwd?: string): Promise<void> {
    try {
      pdfDoc = await pdfjs.getDocument({
        ...(_props.url && { url: _props.url }),
        ...(_props.path && { url: _props.path }),
        ...(_props.data && { data: _props.data }),
        ...(_props.httpHeaders && { httpHeaders: _props.httpHeaders }),
        ...(_props.password && { password: _props.password }),
        ...(pwd && { password: pwd }),
        ...(_props.additionalParams && { ..._props.additionalParams }),
        standardFontDataUrl:
          _props.additionalParams?.standardFontDataUrl ??
          "https://mozilla.github.io/pdf.js/web/standard_fonts/",
      }).promise;

      isPdfLoadSuccess = true;
      const pageContent = await renderPage(pdfDoc, _props.page);
      isPdfPageRenderSuccess = true;

      dispatch("load_success", { totalPages: pdfDoc.numPages, ...pageContent });
    } catch (error: unknown) {
      const parsedError = parseError(error);
      switch (parsedError.name) {
        case PdfExceptionName.PasswordRequiredException: {
          isPdfPasswordProtected = true;
          dispatch("password_required");
          return;
        }
        case PdfExceptionName.IncorrectPasswordException: {
          dispatch("incorrect_password");
          return;
        }
        default: {
          dispatch("load_failure", parsedError);
        }
      }
      isPdfLoadFailure = true;
      isPdfLoadSuccess = false;
    } finally {
      isPdfLoading = false;
    }
  }

  function fillCanvas(
    page: PDFPageProxy,
    scale: number,
    rotation: number,
    offsetX: number,
    offsetY: number,
  ): Promise<void> {
    const pageRotation = rotation + getPageRotation(page._pageInfo);
    const canvasContext = canvas.getContext("2d");
    const viewport = page.getViewport({ scale, rotation: pageRotation, offsetX, offsetY });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    return pdfPage.render({ canvasContext, viewport }).promise;
  }
</script>

{#if isPdfLoadSuccess}
  <canvas
    class:show={isPdfPageRenderSuccess}
    {...isPdfPageRenderSuccess && { ...$$restProps }}
    bind:this={canvas}
  />
{/if}
{#if !isPdfPageRenderSuccess}
  {#if isPdfLoading}
    <slot name="loading" />
  {:else if isPdfPasswordProtected}
    <slot name="password_required" />
  {:else if isPdfLoadFailure}
    <slot name="loading_failed" />
  {/if}
{/if}

<style>
  canvas {
    display: none;
  }

  .show {
    display: block;
  }
</style>
