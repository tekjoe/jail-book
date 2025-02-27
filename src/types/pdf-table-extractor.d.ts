declare module 'pdf-table-extractor' {
  interface PdfTableExtractorResult {
    pageTables: {
      page: number;
      tables: string[][];
    }[];
  }

  type SuccessCallback = (result: PdfTableExtractorResult) => void;
  type ErrorCallback = (error: any) => void;

  function pdf_table_extractor(
    pdfPath: string,
    successCallback: SuccessCallback,
    errorCallback: ErrorCallback
  ): void;

  export = pdf_table_extractor;
} 