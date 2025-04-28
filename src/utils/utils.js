import {readPdfText} from "pdf-text-reader";

export async function extractTextFromPDF(filePath) {
    console.log(filePath)
    const pdfText = await readPdfText({url: filePath});
    console.info(pdfText);
    return pdfText;
}
