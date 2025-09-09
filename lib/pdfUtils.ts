// utils/pdfUtils.ts
import PDFParser from 'pdf2json';

export const extractTextFromPDF = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (errData) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        const text = pdfData.Pages.map((page) =>
          page.Texts.map(
            (t) => decodeURIComponent(t.R[0].T) // decode URL-encoded text
          ).join(' ')
        ).join('\n');

        resolve(text);
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
};
