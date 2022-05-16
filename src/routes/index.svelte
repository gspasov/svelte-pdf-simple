<script lang="ts">
  import { PdfViewer } from "svelte-pdf-simple";
  import type {
    PdfLoadFailureContent,
    PdfLoadSuccessContent,
    PdfPageContent,
  } from "svelte-pdf-simple";

  let pdfViewer: PdfViewer;
  let pageNumber = 0;
  let totalPages = 0;
  let isPdfLoaded = false;
  let password = "";
  let scale = 1.5;

  const pdfPathWithPassword = "./exampleProtected.pdf";
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
      "dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G",
  );

  function handleNextPage(event: CustomEvent<PdfPageContent>): void {
    console.info("next", event.detail);
    pageNumber++;
  }

  function handlePrevPage(event: CustomEvent<PdfPageContent>): void {
    console.info("prev", event.detail);
    pageNumber--;
  }

  function onNextPage(): void {
    pdfViewer.next();
  }

  function onPrevPage(): void {
    pdfViewer.prev();
  }

  function onZoomIn(): void {
    scale += 0.1;
    pdfViewer.resize(scale);
  }

  function onZoomOut(): void {
    scale -= 0.1;
    pdfViewer.resize(scale);
  }

  function handleLoadedSuccess(event: CustomEvent<PdfLoadSuccessContent>) {
    console.info("loaded", event.detail);
    totalPages = event.detail.pages;
    pageNumber = 1;
    isPdfLoaded = true;
  }

  function handleLoadFailure(event: CustomEvent<PdfLoadFailureContent>) {
    console.info("failed", event.detail);
  }
</script>

<main>
  {#if isPdfLoaded}
    <button on:click={onPrevPage}>prev</button>
    <button on:click={onNextPage}>next</button>
    <span>{pageNumber}/{totalPages}</span>
    <button on:click={onZoomIn}>zoom in</button>
    <button on:click={onZoomOut}>zoom out</button>
  {/if}
  <PdfViewer
    bind:this={pdfViewer}
    url={pdfPathWithPassword}
    {scale}
    style={"border: 1px solid black; display: block; margin-top: 10px;"}
    withAnnotations={true}
    withTextContent={true}
    on:load_success={handleLoadedSuccess}
    on:load_failure={handleLoadFailure}
    on:next={handleNextPage}
    on:prev={handlePrevPage}
  >
    <svelte:fragment slot="loading">Loading pdf..</svelte:fragment>
    <svelte:fragment slot="loading-failed">Well... something went wrong :(</svelte:fragment>
    <svelte:fragment slot="password-required">
      <p>This pdf is password protected. Please enter the password to view it.</p>
      <input type="password" bind:value={password} />
      <button on:click={() => pdfViewer.openWithPassword(password)}>unlock</button>
      <div><span><i>Hint: '123456'</i></span></div>
    </svelte:fragment>
  </PdfViewer>
</main>
