import { PdfExceptionName, type PdfException } from "./types";

export function parseError(error: unknown): PdfException {
  if (error instanceof Error) {
    const buildError = { message: error.message };
    switch (error.name) {
      case "PasswordException": {
        if (error.message === "No password given") {
          return { ...buildError, name: PdfExceptionName.PasswordRequiredException };
        } else if (error.message === "Incorrect Password") {
          return { ...buildError, name: PdfExceptionName.IncorrectPasswordException };
        }
        return { ...buildError, name: PdfExceptionName.UnknownErrorException };
      }
      case PdfExceptionName.AbortException:
        return { ...buildError, name: PdfExceptionName.AbortException };
      case PdfExceptionName.FormatError:
        return { ...buildError, name: PdfExceptionName.FormatError };
      case PdfExceptionName.InvalidPDFException:
        return { ...buildError, name: PdfExceptionName.InvalidPDFException };
      case PdfExceptionName.MissingPDFException:
        return { ...buildError, name: PdfExceptionName.MissingPDFException };

      case PdfExceptionName.UnexpectedResponseException:
        return { ...buildError, name: PdfExceptionName.UnexpectedResponseException };
      default:
        return { ...buildError, name: PdfExceptionName.UnknownErrorException };
    }
  }
  return { name: PdfExceptionName.UnknownErrorException, message: JSON.stringify(error) };
}
