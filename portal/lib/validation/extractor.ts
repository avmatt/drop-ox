import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

function extractTextFromTextFile(buffer: Buffer) {
  return buffer.toString("utf-8");
}

async function extractTextFromPdf(buffer: Buffer) {
  const data = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );
  const document = await getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");

    if (pageText.trim().length > 0) {
      pages.push(pageText);
    }
  }

  return pages.join(" \n ");
}

async function extractTextFromWord(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
}

async function extractTextFromImage(buffer: Buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return data?.text ?? "";
}

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = (file.type || "").toLowerCase();
  const extension = (file.name.split(".").pop() || "").toLowerCase();

  if (mimeType === "application/pdf" && extension === "pdf") {
    return extractTextFromPdf(buffer);
  }

  if (
    (mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
    (extension === "doc" || extension === "docx")
  ) {
    return extractTextFromWord(buffer);
  }

  if (
    mimeType.startsWith("image/") ||
    ["png", "jpg", "jpeg"].includes(extension)
  ) {
    return extractTextFromImage(buffer);
  }

  return extractTextFromTextFile(buffer);
}