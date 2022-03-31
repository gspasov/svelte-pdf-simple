# svelte-pdf-simple

![npm](https://img.shields.io/npm/v/svelte-pdf-simple?style=flat-square)
![npm](https://img.shields.io/npm/dw/svelte-pdf-simple?style=flat-square)

Simple svelte PDF Viewer component where controls are left to be added by the User.
This Simple PDF Viewer does not assume any functionality, so Users can customize it as they see fit.

## How to install

```
npm install svelte-pdf-simple
```

or

```
yarn add svelte-pdf-simple
```

## How to use

With path:

```svelte
<script lang="ts">
  import { PdfViewer } from "svelte-pdf-simple";
  const pathToPdf = "./example.pdf"
</script>

<PdfViewer pdfUrl={pathToMyPdf}>
```

With url:

```svelte
<script lang="ts">
  import { PdfViewer } from "svelte-pdf-simple";
  const urlToPdf = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf"
</script>

<PdfViewer pdfUrl={urlToMyPdf}>
```

With `Base64` encoded string:

```svelte
<script lang="ts">
  import { PdfViewer } from "svelte-pdf-simple";
  const base64EncodedString = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G"
</script>

<PdfViewer pdfBin={atob(base64EncodedString)}>
```

## Full example with handling navigation and load state

```svelte
<script lang="ts">
  import { PdfViewer, PdfPageContent, PdfLoadedContent } from "svelte-pdf-simple";

  let pdfViewer: PdfViewer;
  let pageNumber = 0;
  let totalPages = 0;
  let isPdfLoaded = false;

  function onNextPage(): void {
    pdfViewer.next();
  }

  function onPrevPage(): void {
    pdfViewer.prev();
  }

  function handleNextPage(event: CustomEvent<PdfPageContent>): void {
    pageNumber++;
  }

  function handlePrevPage(event: CustomEvent<PdfPageContent>): void {
    pageNumber--;
  }

  function handlePdfLoaded(event: CustomEvent<PdfLoadedContent>): void {
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
    pdfUrl={"./example.pdf"}
    scale={1.5}
    style={"border: 1px solid black; display: block;"}
    on:loaded={handlePdfLoaded}
    on:next={handleNextPage}
    on:prev={handlePrevPage}
  >
    <div slot="loading">Loading pdf..</div>
    <div slot="loading-failed">Well... something went wrong :(</div>
  </PdfViewer>
</main>
```

## Props

| property   | type     | default | Required |
| ---------- | -------- | ------- | -------- |
| `pdfUrl`   | `string` | `N/A`   | `No`     |
| `pdfBin`   | `string` | `N/A`   | `No`     |
| `scale`    | `float`  | `1.0`   | `No`     |
| `page`     | `number` | `1`     | `No`     |
| `rotation` | `number` | `0`     | `No`     |
| `offsetX`  | `number` | `0`     | `No`     |
| `offsetY`  | `number` | `0`     | `No`     |
| `style`    | `string` | `""`    | `No`     |

**NB: Use either `pdfUrl` of `pdfBin` when initializing PdfViewer !!**

The `pdfUrl` property accepts either a path to a file (_located in `/public` folder of your Svelte project_), or a url leading to the pdf (_there are some specifics to this, please read more in [Using PDFs from links](#using-pdfs-from-links)_)

## Handling

| function | usage               |
| -------- | ------------------- |
| `next`   | `move to next page` |
| `prev`   | `move to prev page` |

## Dispatch Events

| event    | usage                                   |
| -------- | --------------------------------------- |
| `next`   | `callback on page move forward`         |
| `prev`   | `callback on page move backward`        |
| `loaded` | `callback when pdf is loaded on screen` |

## Demo example

An example usage could be found in the `/example` directory in the project. It provides a simple way to handle page navigation and page count.

To view the example, clone the **svelte-pdf-simple** repo and install the dependencies:

```bash
$ git clone https://github.com/gspasov/svelte-pdf-simple.git
$ cd example
$ npm install
$ npm run dev
```

## Using PDFs from links

Bare in mind that the `pdf.js` library enforces `cors`, therefore if you whish to supply a PDF which is coming from a link, the server serving this pdf should have appropriate CORS settings in the headers. For more information about this please follow [this issue in pdf.js](https://github.com/mozilla/pdf.js/issues/3150#issuecomment-17582371)

For example, if you are hosting your pds in AWS S3, the following CORS setting work:

```json
[
  {
    "AllowedHeaders": ["Authorization", "Range"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"], // supply custom origin
    "ExposeHeaders": [
      "Accept-Ranges",
      "Content-Range",
      "Content-Encoding",
      "Content-Length"
    ]
  }
]
```

## Contributing

If you would like to see some change/modification open an Issue or a PR. I'd be happy to look into it.

## License

**MIT**
