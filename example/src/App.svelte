<script lang="ts">
  import PdfViewer from "svelte-pdf-simple";

  let pdfViewer: PdfViewer;
  let pageNumber = 0;
  let totalPages = 0;
  let isPdfLoaded = false;

  function handleNextPage(): void {
    pdfViewer.next();
  }

  function handlePrevPage(): void {
    pdfViewer.prev();
  }

  function handlePdfLoaded(event: CustomEvent<{ pages: number }>) {
    totalPages = event.detail.pages;
    pageNumber = 1;
    isPdfLoaded = true;
  }
</script>

<main>
  {#if isPdfLoaded}
    <button on:click={handlePrevPage}>prev</button>
    <button on:click={handleNextPage}>next</button>
    <span>{pageNumber}/{totalPages}</span>
  {/if}
  <PdfViewer
    bind:this={pdfViewer}
    pdf={"./example.pdf"}
    scale={1.5}
    style={"border: 1px solid black; display: block;"}
    on:loaded={handlePdfLoaded}
    on:next={() => pageNumber++}
    on:prev={() => pageNumber--}
  >
    <div slot="loading">Loading pdf..</div>
    <div slot="loading-failed">Well... something went wrong :(</div>
  </PdfViewer>
</main>
