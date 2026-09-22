"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";

type DeleteDocumentTypeDialogProps = {
  documentTypeId: string;
  action: (formData: FormData) => Promise<void>;
};

export function DeleteDocumentTypeDialog({
  documentTypeId,
  action,
}: DeleteDocumentTypeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        variant="secondary"
        className="mt-4 border-red-300 text-red-800 hover:bg-red-100"
      >
        Delete Document Type
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-zinc-900">
              Confirm Deletion
            </DialogTitle>

            <p className="mt-3 text-sm text-zinc-700">
              Deleting this document type is permanent and cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>

              <form action={action}>
                <input type="hidden" name="id" value={documentTypeId} />
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                >
                  Confirm Delete
                </Button>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}