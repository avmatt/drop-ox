import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client";
import { ProjectStatus } from "../generated/enums";
import { Pool } from "pg";

import DOCUMENT_TYPES from "./data/document-types.json";
import PROJECTS from "./data/projects.json";

const PROJECT_STATUS_VALUES = Object.values(ProjectStatus);

function toProjectStatus(value: string) {
  if (!PROJECT_STATUS_VALUES.includes(value as (typeof ProjectStatus)[keyof typeof ProjectStatus])) {
    throw new Error(`Unsupported project status: ${value}`);
  }

  return value as (typeof ProjectStatus)[keyof typeof ProjectStatus];
}

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

  for (const project of PROJECTS) {
    const existingProject = await prisma.project.findUnique({
      where: { code: project.code },
    });

    if (existingProject === null) {
      await prisma.project.create({
        data: {
          code: project.code,
          name: project.name,
          client: project.client,
          status: toProjectStatus(project.status),
          summary: project.summary,
          description: project.description,
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : null,
          isActive: project.isActive,
        },
      });
      continue;
    }

    await prisma.project.update({
      where: { id: existingProject.id },
      data: {
        code: project.code,
        name: project.name,
        client: project.client,
        status: toProjectStatus(project.status),
        summary: project.summary,
        description: project.description,
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : null,
        isActive: project.isActive,
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
