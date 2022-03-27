<script lang="ts">
  import {
    PDFDocumentProxy,
    getDocument,
    GlobalWorkerOptions,
  } from "pdfjs-dist";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  export let page: number = 1;
  export let pdfUrl: string | undefined = undefined;
  export let pdfBin: string | undefined = undefined;
  export let scale: number = 1.0;
  export let rotation: number = 0;
  export let offsetX: number = 0;
  export let offsetY: number = 0;
  export let style: string = "";
  export const next = (): void => {
    if (page === pdfDoc.numPages) return;
    page++;
    renderPage(page);
    dispatch("next");
  };
  export const prev = (): void => {
    if (page === 1) return;
    page--;
    renderPage(page);
    dispatch("prev");
  };

  let canvas: HTMLCanvasElement;
  let pdfDoc: PDFDocumentProxy;
  $: pdfIsLoading = true;
  $: pdfLoadedSucessfully = false;

  const dispatch = createEventDispatcher();

  GlobalWorkerOptions.workerSrc =
    "//unpkg.com/pdfjs-dist@2.12.313/legacy/build/pdf.worker.min.js";

  onMount(async () => {
    if (pdfUrl === undefined && pdfBin === undefined) {
      throw new Error(
        "PdfViewer failed to display with error: 'No pdf source provided'"
      );
    }
    await initialPdfLoad();
  });

  async function renderPage(pageNumber: number): Promise<void> {
    pdfDoc.getPage(pageNumber).then((page_) => {
      const viewport = page_.getViewport({ scale, rotation, offsetX, offsetY });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const canvasContext = canvas.getContext("2d");
      if (canvasContext !== null) {
        page_.render({ canvasContext, viewport });
      }
    });
  }

  async function initialPdfLoad(): Promise<void> {
    await getDocument({
      ...(pdfUrl && { url: pdfUrl }),
      ...(pdfBin && { data: pdfBin }),
    })
      .promise.then((doc) => {
        pdfLoadedSucessfully = true;
        dispatch("loaded", { pages: doc.numPages });
        pdfDoc = doc;
      })
      .catch((e: unknown) => {
        pdfLoadedSucessfully = false;
        console.error("Pdfjs failed to load with:", JSON.stringify(e));
      })
      .finally(() => {
        pdfIsLoading = false;
      });

    renderPage(page);
  }
</script>

{#if pdfLoadedSucessfully && !pdfIsLoading}
  <canvas {style} class="simple-pdf-svelte-canvas" bind:this={canvas} />
{:else if pdfIsLoading}
  <slot name="loading" />
{:else}
  <slot name="loading-failed" />
{/if}
