<script lang="ts">
  import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type {
    PageChangedEvent,
    PdfLoadSuccess,
    PdfLoadFailure,
    PdfPageContent,
    PDFDocumentProxy,
    PDFPageProxy,
    TextContent,
    AdditionalParameters,
    TypedArray,
    Degrees,
  } from "./types";
  import { isPdfException, PasswordError, PdfExceptionType } from "./types";

  export let url: string | URL | undefined = undefined;
  export let data: string | number[] | TypedArray | undefined = undefined;
  export let httpHeaders: Record<string, string> | undefined = undefined;
  export let password: string | undefined = undefined;
  export let additionalParams: AdditionalParameters | undefined = undefined;

  export let page = 1;
  export let scale = 1.0;
  export let rotation: Degrees = 0;
  export let offsetX = 0;
  export let offsetY = 0;
  export let style = "";
  export let withAnnotations = false;
  export let withTextContent = false;

  export function goToPage(pageNumber: number): void {
    if (pageNumber > pdfDoc.numPages || pageNumber < 1) return;
    renderPage(pdfDoc, pageNumber).then((pageContent): void => {
      dispatchPageChanged("page_changed", pageContent);
    });
  }

  export function resize(newScale: number): void {
    fillCanvas(pdfPage, newScale, rotation, offsetX, offsetY);
  }

  export function rotate(degrees: Degrees): void {
    fillCanvas(pdfPage, scale, degrees, offsetX, offsetY);
  }

  export function openWithPassword(password: string): void {
    (async () => await loadPdf(password))();
  }

  let canvas: HTMLCanvasElement;
  let pdfDoc: PDFDocumentProxy;
  let pdfPage: PDFPageProxy;
  $: isPdfLoading = true;
  $: isPdfLoadSuccess = false;
  $: isPdfLoadFailure = false;
  $: isPdfPageRenderSuccess = false;
  $: isPdfPasswordProtected = false;

  const dispatchLoadSuccess = createEventDispatcher<PdfLoadSuccess>();
  const dispatchLoadFailure = createEventDispatcher<PdfLoadFailure>();
  const dispatchPageChanged = createEventDispatcher<PageChangedEvent>();
  const dispatch = createEventDispatcher();

  GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@2.13.216/legacy/build/pdf.worker.min.js";

  onMount(async () => {
    if (url === undefined && data === undefined) {
      throw new Error("PdfViewer failed to initialize with error: 'No pdf source provided'");
    }
    await loadPdf();
  });

  function getPageRotation(pdfPageInfo: unknown): Degrees | undefined {
    const key = "rotate";
    if (
      typeof pdfPageInfo === "object" &&
      pdfPageInfo !== null &&
      Object.prototype.hasOwnProperty.call(pdfPageInfo, key) &&
      typeof pdfPageInfo[key] === "number"
    ) {
      return pdfPageInfo[key] as Degrees;
    }

    return undefined;
  }

  async function renderPage(doc: PDFDocumentProxy, pageNumber: number): Promise<PdfPageContent> {
    pdfPage = await doc.getPage(pageNumber);

    let annotations: Record<string, unknown>[] | undefined = undefined;
    let textContent: TextContent | undefined = undefined;
    if (withAnnotations) {
      annotations = Object.values(await pdfPage.getAnnotations());
    }
    if (withTextContent) {
      textContent = await pdfPage.getTextContent();
    }
    await fillCanvas(pdfPage, scale, rotation, offsetX, offsetY);

    return {
      annotations,
      textContent,
      pageNumber,
      pageRotation: getPageRotation(pdfPage._pageInfo),
    };
  }

  async function loadPdf(pwd: string | undefined = undefined): Promise<void> {
    try {
      pdfDoc = await getDocument({
        ...(url && { url }),
        ...(data && { data }),
        ...(httpHeaders && { httpHeaders }),
        ...(password && { password }),
        ...(pwd && { password: pwd }),
        ...(additionalParams && { ...additionalParams }),
      }).promise;

      isPdfLoadSuccess = true;
      const pageContent = await renderPage(pdfDoc, page);
      isPdfPageRenderSuccess = true;

      dispatchLoadSuccess("load_success", { pages: pdfDoc.numPages, ...pageContent });
    } catch (error: unknown) {
      if (isPdfException(error)) {
        if (
          error.name === PdfExceptionType.PasswordException &&
          error.message === PasswordError.PasswordRequired
        ) {
          isPdfPasswordProtected = true;
          dispatch("password_required");
          return;
        } else if (
          error.name === PdfExceptionType.PasswordException &&
          error.message === PasswordError.IncorrectPassword
        ) {
          dispatch("incorrect_password");
          return;
        }
        dispatchLoadFailure("load_failure", {
          message: error.message,
          name: error.name,
          code: error.code,
        });
      } else if (error instanceof Error) {
        dispatchLoadFailure("load_failure", error);
      } else {
        dispatchLoadFailure("load_failure", JSON.stringify(error));
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
    style={isPdfPageRenderSuccess && style}
    bind:this={canvas}
  />
{/if}
{#if !isPdfPageRenderSuccess}
  {#if isPdfLoading}
    <slot name="loading" />
  {:else if isPdfPasswordProtected}
    <slot name="password-required" />
  {:else if isPdfLoadFailure}
    <slot name="loading-failed" />
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
