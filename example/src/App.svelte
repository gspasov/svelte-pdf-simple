<script lang="ts">
  import {
    NextPage,
    PdfLoadedPayload,
    PdfViewer,
    PrevPage,
  } from "svelte-pdf-simple";

  let pdfViewer: PdfViewer;
  let pageNumber = 0;
  let totalPages = 0;
  let isPdfLoaded = false;

  const pdfPathWithForm = "./formExample.pdf";
  const pdfUrl =
    "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf";
  const pdfPath = "./example.pdf";
  const pdfFromBase64 = atob(
    "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog" +
      "IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv" +
      "TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K" +
      "Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg" +
      "L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+" +
      "PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u" +
      "dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq" +
      "Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU" +
      "CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu" +
      "ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g" +
      "CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw" +
      "MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v" +
      "dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G"
  );

  function handleNextPage(event: CustomEvent<NextPage>): void {
    console.info("next", event.detail);
    pageNumber++;
  }

  function handlePrevPage(event: CustomEvent<PrevPage>): void {
    console.info("prev", event.detail);
    pageNumber--;
  }

  function onNextPage(): void {
    pdfViewer.next();
  }

  function onPrevPage(): void {
    pdfViewer.prev();
  }

  function handlePdfLoaded(event: CustomEvent<PdfLoadedPayload>) {
    console.info("pdf loaded", event.detail);
    totalPages = event.detail.pages;
    pageNumber = 1;
    isPdfLoaded = true;
  }
</script>

<main>
  {#if isPdfLoaded}
    <button on:click={onPrevPage}>prev</button>
    <button on:click={onNextPage}>next</button>
    <span>{pageNumber}/{totalPages}</span>
  {/if}
  <PdfViewer
    bind:this={pdfViewer}
    pdfUrl={pdfPath}
    scale={1.5}
    style={"border: 1px solid black; display: block;"}
    withAnnotations={true}
    withTextContent={true}
    on:loaded={handlePdfLoaded}
    on:next={handleNextPage}
    on:prev={handlePrevPage}
  >
    <div slot="loading">Loading pdf..</div>
    <div slot="loading-failed">Well... something went wrong :(</div>
  </PdfViewer>
</main>
