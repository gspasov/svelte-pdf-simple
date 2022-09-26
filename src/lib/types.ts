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

export type Degrees = 0 | 90 | 180 | 270 | 360;

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
