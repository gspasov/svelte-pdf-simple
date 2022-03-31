import type { TextContent } from "pdfjs-dist/types/src/display/api";

export type PdfPageContent = {
  annotations?: Record<string, unknown>[];
  textContent?: TextContent;
};

export type PdfLoaded = {
  loaded: PdfLoadedContent;
};

export type PdfLoadedContent = {
  pages: number;
} & PdfPageContent;

export type NextPage = {
  next: PdfPageContent;
};

export type PrevPage = {
  prev: PdfPageContent;
};
