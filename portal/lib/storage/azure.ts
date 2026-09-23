import { BlobServiceClient } from "@azure/storage-blob";

const defaultContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME ?? "documents";

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadDocumentToAzure(file: File, folder = "uploads") {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is required.");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(defaultContainerName);

  await containerClient.createIfNotExists({
    access: "blob",
  });

  const safeFileName = sanitizeFileName(file.name || "document");
  const extension = safeFileName.includes(".") ? safeFileName.slice(safeFileName.lastIndexOf(".")) : "";
  const blobName = `${folder.replace(/^\/+|\/+$/g, "")}/${Date.now()}-${crypto.randomUUID()}${extension}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(Buffer.from(await file.arrayBuffer()), {
    blobHTTPHeaders: {
      blobContentType: file.type || "application/octet-stream",
    },
  });

  return {
    url: blockBlobClient.url,
    blobName,
  };
}
