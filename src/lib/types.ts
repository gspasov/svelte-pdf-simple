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
  load_success: PdfLoadSuccessContent;
};

export type PdfLoadFailure = {
  load_failure: PdfLoadFailureContent;
};

export type PdfLoadFailureContent = PdfException | Error | string;

export type PdfLoadSuccessContent = {
  pages: number;
} & PdfPageContent;

export type NextPage = {
  next: PdfPageContent;
};

export type PrevPage = {
  prev: PdfPageContent;
};

export type PdfException = {
  message: string;
  name: string;
  code: string;
};

export function isPdfException(value: unknown): value is PdfException {
  const exception = value as PdfException;
  return (
    exception.code !== undefined &&
    typeof exception.code === "number" &&
    exception.name !== undefined &&
    typeof exception.name === "string" &&
    exception.message !== undefined &&
    typeof exception.message === "string"
  );
}

export enum PdfExceptionType {
  PasswordException = "PasswordException",
  UnknownErrorException = "UnknownErrorException",
  InvalidPDFException = "InvalidPDFException",
  MissingPDFException = "MissingPDFException",
  UnexpectedResponseException = "UnexpectedResponseException",
  FormatError = "FormatError",
  AbortException = "AbortException",
}

export enum PasswordError {
  PasswordRequired = "No password given",
  IncorrectPassword = "Incorrect Password",
}
