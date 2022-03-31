<script lang="ts">
  import {
    PDFDocumentProxy,
    getDocument,
    GlobalWorkerOptions,
  } from "pdfjs-dist";
  import type { TextContent } from "pdfjs-dist/types/src/display/api";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type { NextPage, PdfLoaded, PdfPageContent, PrevPage } from "./types";

  export let page: number = 1;
  export let pdfUrl: string | undefined = undefined;
  export let pdfBin: string | undefined = undefined;
  export let scale: number = 1.0;
  export let rotation: number = 0;
  export let offsetX: number = 0;
  export let offsetY: number = 0;
  export let style: string = "";
  export let withAnnotations = false;
  export let withTextContent = false;

  export const next = (): void => {
    if (page === pdfDoc.numPages) return;
    page++;
    renderPage(pdfDoc, page).then((page): void => {
      dispatchNext("next", page);
    });
  };

  export const prev = (): void => {
    if (page === 1) return;
    page--;
    renderPage(pdfDoc, page).then((page): void => {
      dispatchPrev("prev", page);
    });
  };

  let canvas: HTMLCanvasElement;
  let pdfDoc: PDFDocumentProxy;
  $: pdfIsLoading = true;
  $: pdfLoadedSucessfully = false;

  const dispatchLoaded = createEventDispatcher<PdfLoaded>();
  const dispatchNext = createEventDispatcher<NextPage>();
  const dispatchPrev = createEventDispatcher<PrevPage>();

  GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@2.13.216/legacy/build/pdf.worker.min.js";

  onMount(async () => {
    if (pdfUrl === undefined && pdfBin === undefined) {
      throw new Error(
        "PdfViewer failed to initialize with error: 'No pdf source provided'"
      );
    }
    await initialPdfLoad();
  });

  async function renderPage(
    doc: PDFDocumentProxy,
    pageNumber: number
  ): Promise<PdfPageContent> {
    const pdfPage = await doc.getPage(pageNumber);

    const viewport = pdfPage.getViewport({ scale, rotation, offsetX, offsetY });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const canvasContext = canvas.getContext("2d");
    if (canvasContext !== null) {
      pdfPage.render({ canvasContext, viewport });
    }

    let annotations: Record<string, unknown>[] | undefined = undefined;
    let textContent: TextContent | undefined = undefined;
    if (withAnnotations) {
      annotations = Object.values(await pdfPage.getAnnotations());
    }
    if (withTextContent) {
      textContent = await pdfPage.getTextContent();
    }

    return { annotations, textContent };
  }

  async function initialPdfLoad(): Promise<void> {
    try {
      pdfDoc = await getDocument({
        ...(pdfUrl && { url: pdfUrl }),
        ...(pdfBin && { data: pdfBin }),
      }).promise;
      pdfLoadedSucessfully = true;
      renderPage(pdfDoc, page).then((page): void => {
        dispatchLoaded("loaded", { pages: pdfDoc.numPages, ...page });
      });
    } catch (e: unknown) {
      pdfLoadedSucessfully = false;
      console.error("Pdfjs failed to load with:", JSON.stringify(e));
    } finally {
      pdfIsLoading = false;
    }
  }
</script>

{#if pdfLoadedSucessfully && !pdfIsLoading}
  <canvas {style} class="simple-pdf-svelte-canvas" bind:this={canvas} />
{:else if pdfIsLoading}
  <slot name="loading" />
{:else}
  <slot name="loading-failed" />
{/if}
