"use server";

export async function extractAction(formData: FormData) {
  // Require pdf2json correctly
  const PDFParser = require("pdf2json");

  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    throw new Error("No file uploaded");
  }

  // Convert Blob → Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<{ text: string }>((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error(errData.parserError));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      if (!pdfData?.Pages) {
        return resolve({ text: "No text found in document." });
      }

      const pages = pdfData.Pages.map((page: any) =>
        page.Texts.map((t: any) =>
          decodeURIComponent(t.R[0].T)
        ).join(" ")
      );

      resolve({ text: pages.join("\n\n") });
    });

    pdfParser.parseBuffer(buffer);
  });
}

