"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

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
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
      >
        Delete Document Type
      </button>

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
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
              >
                Cancel
              </button>

              <form action={action}>
                <input type="hidden" name="id" value={documentTypeId} />
                <button
                  type="submit"
                  className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                >
                  Confirm Delete
                </button>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}