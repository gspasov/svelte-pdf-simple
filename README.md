# svelte-pdf-simple

![npm](https://img.shields.io/npm/v/svelte-pdf-simple?style=flat-square)
![npm](https://img.shields.io/npm/dw/svelte-pdf-simple?style=flat-square)

Simple svelte PDF Viewer, packed with features and functionalities. Fully cusomizable navigation controls and styles.

## Functionality / Benefits
- Displays PDF from file, url or binary/Base64 encoded string.
- Exports functions for managing custom page navigation, resizing and opening a password protected PDF.
- Provides **slots** which can be used when **PDF is loading** | **PDF has failed to load** | **PDF requires password**.
- Provides callbacks for **successful**/**unsuccessful** loading of the PDF.
- Provides callbacks for **forward** and **backward** navigation of the PDF.
- Provides access to PDF annotations and text content.
- Allows custom styling on the `canvas` tag where the PDF is loaded.
- Exports various properties for PDF setup: `scale`, `rotation`, `offsetX`, `offsetY`.
- You can determine on which page the PDF should be loaded.
- Has full type support. 
- Written in TypeScript.

## How to install
Add to your **Svelte** or **SvelteKit** project with the following lines:

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

<PdfViewer url={pathToPdf}>
```

With url:

```svelte
<script lang="ts">
  import { PdfViewer } from "svelte-pdf-simple";
  const urlToPdf = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf"
</script>

<PdfViewer url={urlToPdf}>
```

With `Base64` encoded string:

```svelte
<script lang="ts">
  import { PdfViewer } from "svelte-pdf-simple";
  const base64EncodedString = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G"
</script>

<PdfViewer data={atob(base64EncodedString)}>
```

## Full example with handling navigation, load state and potential password locked PDF

```svelte
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

  function handleNextPage(event: CustomEvent<PdfPageContent>): void {
    pageNumber++;
  }

  function handlePrevPage(event: CustomEvent<PdfPageContent>): void {
    pageNumber--;
  }

  function onNextPage(): void {
    pdfViewer.next();
  }

  function onPrevPage(): void {
    pdfViewer.prev();
  }

  function onUnlock(): void {
    pdfViewer.openWithPassword(password);
  }

  function handleLoadedSuccess(event: CustomEvent<PdfLoadSuccessContent>) {
    totalPages = event.detail.pages;
    pageNumber = 1;
    isPdfLoaded = true;
  }

  function handleLoadFailure(event: CustomEvent<PdfLoadFailureContent>) {
    // Put your logic on how to handle PDF loading failure
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
    url={"./example.pdf"}
    scale={1.5}
    style={"border: 1px solid black; display: block; margin-top: 10px;"}
    withAnnotations={true}
    withTextContent={true}
    on:load_success={handleLoadedSuccess}
    on:load_failure={handleLoadFailure}
    on:next={handleNextPage}
    on:prev={handlePrevPage}
  >
    <div slot="loading">Loading pdf..</div>
    <div slot="loading-failed">Well... something went wrong :(</div>
    <div slot="password-required">
      <p>This pdf is password protected. Please enter the password to view it.</p>
      <input type="password" bind:value={password} />
      <button on:click={onUnlock}>unlock</button>
    </div>
  </PdfViewer>
</main>

```

## Props

**NB: Specify either a `url` or `data` when initializing PdfViewer !!**

| Prop name | Description | Type   | Default value | Required |
| --------- | ----------- |------- | ------------- | -------- |
| url      | What PDF to load. The url can be either a `path` to a file  (usually located in the `/public` folder of your Svelte project, e.g. _./myPdf.pdf_) or a `url` (e.g. _https://my-domain.com/myPdf.pdf_). **When loading PDF from a `url` there are some specifics to be considered. [Read more](#using-pdfs-from-links)**. | string &#124; URL &#124; undefined | N/A | No |
| data     | Provided when you want to specify a `pdf` either in binary form or a Base64 encoded pdf. When providing a Base64 encoded pdf use `atob` function to convert it to it's binary form when providing it in the `data` prop. | string &#124; number[] &#124; TypedArray &#124; undefined | N/A | No |
| password | Specifies the password used to unlock protected pdf. | string &#124; undefined | N/A | No |
| httpHeaders | Specifies headers needed when you are accessing a pdf from a url that requires authentication. | Record<string, string> &#124; undefined | N/A | No |
| additionalParams | Additional `pdfjs` related parameters which you could add if necessary. | AdditionalParameters &#124; undefined | N/A | No |
| withAnnotations | Specifies whether you'll like to attach annotations from the pages you load. | boolean | False | No |
| withTextContent | Specifies whether you'll like to attach the text content from the pages you load. | boolean | False | No |
| scale    | Specifies how large you'll like your pdf to be displayed. | number (decimal) | 1.0 | No |
| page     | On which page should the pdf open when it loads. | number | 1 | No |
| rotation | How much you'd like your pdf to be rotated. | number | 0 | No |
| offsetX  | If specified, offsets the pdf on the X axis. | number | 0 | No |
| offsetY  | If specified, offsets the pdf on the Y axis. | number | 0 | No |
| style    | If specified, the styles are attached to the `canvas` element (_in which the pdf is loaded_). | string | "" | No |

## Handling

| Function name | Description | Accepted parameter type |
| ------------- | ----------- | ----------------------- |
| `next/0` | Moves to the next page of the PDF. | N/A |
| `prev/0` | Moves to the previous page of the PDF. | N/A |
| `resize/1` | Resizes the PDF to the desired scale value. | number (decimal) |
| `openWithPassword/1` | Tries to open a locked PDF with the provided password. | string |

## Dispatch Events

| Event name | Description |
| ---------- | ----------- |
| `next` | Notifies when PDF moves to next page. This event also holds page `annotations` and `textContents` if they were requested in the `PdfViewer` props. |
| `prev` | Notifies when PDF moves to previous page. This event also holds page `annotations` and `textContents` if they were requested in the `PdfViewer` props |
| `load_success` | Notifies that PDF is successfully loaded. _At this point in time the PDF should be visible on the screen_ |
| `load_failure` | Notifies that some `Error` has ocurred while loading the PDF. |
| `password_required` | Notifies that PDF is password protected and the user should provide a password to unlock the PDF. |
| `incorrect_password` | Notifies that the provided password to unlock the PDF is incorrect. |

## Slots

| Slot name | Description |
| ---------- | ----------- |
| `loading` | This slot is visible while the PDF is loading. |
| `loading-failed` | This slot is visible if PDF has failed to load. |
| `password_required` | This slot is visible if the PDF requires a password to be unlocked. _This is a good spot to place an input form for specifying the password of the PDF_ |

## Demo example

To see an example implementation, clone the **svelte-pdf-simple** repo run the following commands:

```bash
$ git clone https://github.com/gspasov/svelte-pdf-simple.git
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
    "ExposeHeaders": ["Accept-Ranges", "Content-Range", "Content-Encoding", "Content-Length"]
  }
]
```

## Contributing

If you would like to see some change/modification open an Issue or a PR. I'd be happy to look into it.

## License

**MIT**
