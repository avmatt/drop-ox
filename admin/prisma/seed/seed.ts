import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client";
import { Pool } from "pg";

import * as DOCUMENT_TYPES from "./data/document-types.json";

const connectionString = process.env.DATABASE_URL;

if (connectionString === undefined) {
  throw new Error("DATABASE_URL is required");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString,
    }),
  ),
});

async function main() {
  for (const documentType of DOCUMENT_TYPES) {
    const existingDocumentType = await prisma.documentType.findFirst({
      where: { kind: documentType.kind },
    });

    if (existingDocumentType === null) {
      await prisma.documentType.create({
        data: {
          kind: documentType.kind,
          name: documentType.name,
          description: documentType.description,
          summary: documentType.summary,
          structureHints: documentType.structureHints,
          requiredFields: documentType.requiredFields,
          validationRules: documentType.validationRules,
          validationNotes: documentType.validationNotes,
          sampleKeywords: documentType.sampleKeywords,
          isActive: true,
        },
      });
      continue;
    }

    await prisma.documentType.update({
      where: { id: existingDocumentType.id },
      data: {
        kind: documentType.kind,
        name: documentType.name,
        description: documentType.description,
        summary: documentType.summary,
        structureHints: documentType.structureHints,
        requiredFields: documentType.requiredFields,
        validationRules: documentType.validationRules,
        validationNotes: documentType.validationNotes,
        sampleKeywords: documentType.sampleKeywords,
        isActive: true,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });