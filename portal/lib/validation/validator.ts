export type DocumentType = {
  name: string;
  requiredFields: string[];
};

export type DocumentValidationResult = {
  status: "VALID" | "PENDING" | "INVALID";
  notes: string[];
  extractedData: string;
};

const acceptedMimeTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const acceptedExtensions = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "doc",
  "docx",
]);

export function validateDocumentAgainstType(
  definition: DocumentType,
  file: {
    name: string;
    type: string;
    size: number;
    text: string;
  },
): DocumentValidationResult {
  const fileName = (file.name ?? "document").trim();
  const fileType = (file.type ?? "application/octet-stream").toLowerCase();
  const fileSize = typeof file.size === "number" ? file.size : 0;
  const extractedData = file.text ?? "";
  const fileExtension = fileName.includes(".")
    ? (fileName.split(".").pop()?.toLowerCase() ?? "")
    : "";

  const isSupportedFileType =
    acceptedMimeTypes.has(fileType) || acceptedExtensions.has(fileExtension);
  const isWithinSizeLimit = fileSize > 0 && fileSize <= 10 * 1024 * 1024;

  const requiredFields = definition.requiredFields;
  const presentRequiredFields = requiredFields.filter((fieldName) =>
    extractedData.includes(fieldName),
  );

  let status: DocumentValidationResult["status"] = "VALID";
  const notes: string[] = [];
  if (isSupportedFileType) {
    notes.push(
      `The uploaded file is a supported format for ${definition.name}.`,
    );
  } else {
    notes.push(
      `The uploaded file type is not supported for ${definition.name}.`,
    );
    status = "INVALID";
  }

  if (isWithinSizeLimit) {
    notes.push("The file is within the 10MB upload limit.");
  } else {
    notes.push("The file exceeds the 10MB upload limit.");
    status = "INVALID";
  }

  if (requiredFields.length > 0) {
    if (presentRequiredFields.length > 0) {
      notes.push(
        `Required field validation: ${presentRequiredFields.length}/${requiredFields.length} fields were found in the uploaded document.`,
      );
    } else {
      notes.push("The document type does not contain any required fields.");
    }
    if (presentRequiredFields.length < requiredFields.length) {
      status = "INVALID";
    }
  }

  return {
    status,
    notes,
    extractedData,
  };
}
