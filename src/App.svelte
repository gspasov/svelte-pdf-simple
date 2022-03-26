<script lang="ts">
  import PdfViewer from "./pdfViewer.svelte";

  let pageNumber: number = 1;
  let pdfViewer: PdfViewer;
  let totalPages: number = 0;

  function handleNextPage(): void {
    pdfViewer.next();
  }

  function handlePrevPage(): void {
    pdfViewer.prev();
  }

  function handlePdfLoaded(event: CustomEvent<{ pages: number }>) {
    totalPages = event.detail.pages;
  }
</script>

<main>
  <button on:click={handlePrevPage}>prev</button>
  <button on:click={handleNextPage}>next</button>
  <span>{pageNumber}/{totalPages}</span>
  <br />
  <div>
    <PdfViewer
      bind:this={pdfViewer}
      pdf={"/acord.pdf"}
      scale={1.5}
      on:loaded={handlePdfLoaded}
      on:next={() => pageNumber++}
      on:prev={() => pageNumber--}
    >
      <div slot="loading">Loading pdf..</div>
      <div slot="loading-failed">Well... something went wrong :(</div>
    </PdfViewer>
  </div>
</main>

<style>
  div {
    margin: 5px 0px;
    min-width: 360px;
    min-height: 400px;
    display: inline-block;
    border: 1px solid black;
  }
</style>
