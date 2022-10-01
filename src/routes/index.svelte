<script lang="ts">
  import { PdfViewer } from "svelte-pdf-simple";
  import type { PdfLoadSuccess, PdfPageContent } from "svelte-pdf-simple";
  import type { Degrees, PdfException } from "$lib/types";

  let pdfViewer: PdfViewer;
  let pageNumber = 0;
  let totalPages = 0;
  let isPdfLoaded = false;
  let password = "";
  let scale = 1.5;
  let rotation: Degrees = 0;

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

  function handlePageChanged(event: CustomEvent<PdfPageContent>): void {
    console.info("page changed", event.detail);
    pageNumber = event.detail.pageNumber;
  }

  function goToPage(page: number): void {
    pdfViewer.goToPage(page);
  }

  function zoomIn(): void {
    scale += 0.1;
    pdfViewer.resize(scale);
  }

  function zoomOut(): void {
    scale -= 0.1;
    pdfViewer.resize(scale);
  }

  function rotateLeft(): void {
    rotation -= 90;
    pdfViewer.rotate(rotation as Degrees);
  }

  function rotateRight(): void {
    rotation += 90;
    pdfViewer.rotate(rotation as Degrees);
  }

  function handleLoadedSuccess(event: CustomEvent<PdfLoadSuccess>) {
    console.info("loaded", event.detail);
    totalPages = event.detail.totalPages;
    pageNumber = 1;
    isPdfLoaded = true;
  }

  function handleLoadFailure(event: CustomEvent<PdfException>) {
    console.info("failed", event.detail);
  }
</script>

<main>
  {#if isPdfLoaded}
    <button on:click={() => goToPage(pageNumber - 1)}>prev</button>
    <button on:click={() => goToPage(pageNumber + 1)}>next</button>
    <span>{pageNumber}/{totalPages}</span>
    <button on:click={zoomIn}>zoom in</button>
    <button on:click={zoomOut}>zoom out</button>
    <button on:click={rotateLeft}>rotate left</button>
    <button on:click={rotateRight}>rotate right</button>
  {/if}
  <PdfViewer
    bind:this={pdfViewer}
    props={{
      path: pdfPathWithPassword,
      scale,
      withAnnotations: true,
      withTextContent: true,
    }}
    style="border: 1px solid black; display: block; margin-top: 10px;"
    on:load_success={handleLoadedSuccess}
    on:load_failure={handleLoadFailure}
    on:page_changed={handlePageChanged}
  >
    <svelte:fragment slot="loading">Loading pdf..</svelte:fragment>
    <svelte:fragment slot="loading_failed">Well... something went wrong :(</svelte:fragment>
    <svelte:fragment slot="password_required">
      <p>This pdf is password protected. Please enter the password to view it.</p>
      <input type="password" bind:value={password} />
      <button on:click={() => pdfViewer.openWithPassword(password)}>unlock</button>
      <div><span><i>Hint: '123456'</i></span></div>
    </svelte:fragment>
  </PdfViewer>
</main>
