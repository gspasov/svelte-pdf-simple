# svelte-pdf-simple

![npm](https://img.shields.io/npm/dw/svelte-pdf-simple?style=flat-square)
![npm](https://img.shields.io/npm/v/svelte-pdf-simple?style=flat-square)

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

```svelte
<script lang="ts">
  import PdfViewer from "svelte-pdf-simple";
</script>

<PdfViewer pdf={"./example.pdf"}>
```

## Full example with handling navigation and load state

```svelte
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
```

## Props

| property   | type     | default | Required |
| ---------- | -------- | ------- | -------- |
| `pdf`      | `string` | `N/A`   | `Yes`    |
| `scale`    | `float`  | `1.0`   | `No`     |
| `page`     | `number` | `1`     | `No`     |
| `rotation` | `number` | `0`     | `No`     |
| `offsetX`  | `number` | `0`     | `No`     |
| `offsetY`  | `number` | `0`     | `No`     |
| `style`    | `string` | `""`    | `No`     |

The `pdf` property accepts either a path to file (_located in `/public` folder of your Svelte project_), or a url leading to the pdf (_there are some specifics to this, please read more in [Using PDFs from links](#using-pdfs-from-links)_)

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
