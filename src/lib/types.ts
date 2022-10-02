import type {
  TextContent,
  PDFDocumentProxy,
  DocumentInitParameters,
  TypedArray,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";

export { PDFDocumentProxy, PDFPageProxy, TextContent, TypedArray };

export type AdditionalParameters = Omit<
  DocumentInitParameters,
  "url" | "data" | "password" | "httpHeaders"
>;

export type Degrees = -360 | -270 | -180 | -90 | 0 | 90 | 180 | 270 | 360;

export type PdfPageContent = {
  annotations?: Record<string, unknown>[];
  textContent?: TextContent;
  pageRotation?: Degrees;
  pageNumber: number;
};

export type PdfLoadSuccess = {
  totalPages: number;
} & PdfPageContent;

export type PdfLoadFailure = PdfException;

export type PdfException = {
  name: PdfExceptionName;
  message?: string;
};

export enum PdfExceptionName {
  UnknownErrorException = "UnknownErrorException",
  InvalidPDFException = "InvalidPDFException",
  MissingPDFException = "MissingPDFException",
  UnexpectedResponseException = "UnexpectedResponseException",
  FormatError = "FormatError",
  AbortException = "AbortException",
  PasswordRequiredException = "PasswordRequired",
  IncorrectPasswordException = "IncorrectPassword",
}

export type Properties = {
  /**
   * - Url pointing to a pdf.
   */
  url?: string | URL;
  /**
   * - Local path pointing to a pdf.
   */
  path?: string;
  /**
   * - Raw pdf data
   */
  data?: string | number[] | TypedArray;
  /**
   * - Used if you are sourcing pdf from a Url
   * and need authentication or any custom headers to pass
   */
  httpHeaders?: Record<string, string>;
  /**
   * - If the pdf is protected by password, this value will be used to open it
   */
  password?: string;
  /**
   * - Additional parameters exposed by 'pdfjs'
   */
  additionalParams?: AdditionalParameters;
  /**
   * - On which page to open the pdf upon first load
   */
  page?: number;
  /**
   * - How scaled up or down to be the pdf.
   */
  scale?: number;
  /**
   * - Rotation of the pdf
   */
  rotation?: Degrees;
  /**
   * - Offset on the x axis
   */
  offsetX?: number;
  /**
   * - Offset on the y axis
   */
  offsetY?: number;
  /**
   * - Whether or not to load Annotations
   */
  withAnnotations?: boolean;
  /**
   * - Whether or not to load TextContent
   */
  withTextContent?: boolean;
};
