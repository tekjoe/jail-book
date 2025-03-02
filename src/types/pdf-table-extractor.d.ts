declare module 'pdf-table-extractor' {
  function pdf_table_extractor(
    pdfPath: string,
    success_callback: (result: any) => void,
    error_callback: (error: any) => void
  ): void;

  export = pdf_table_extractor;
} 