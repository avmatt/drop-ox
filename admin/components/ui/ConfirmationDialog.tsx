"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { type ReactNode, useState } from "react";

import { Button, type ButtonVariant } from "@/components/ui/Button";

type HiddenField = {
  name: string;
  value: string;
};

type ConfirmationDialogProps = {
  triggerLabel: string;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  action: (formData: FormData) => Promise<void>;
  hiddenFields: HiddenField[];
  triggerVariant?: ButtonVariant;
  triggerClassName?: string;
  confirmVariant?: ButtonVariant;
  confirmClassName?: string;
};

export function ConfirmationDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  action,
  hiddenFields,
  triggerVariant = "secondary",
  triggerClassName,
  confirmVariant = "danger",
  confirmClassName,
}: ConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        variant={triggerVariant}
        className={triggerClassName}
      >
        {triggerLabel}
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-zinc-900">{title}</DialogTitle>

            <div className="mt-3 text-sm text-zinc-700">{description}</div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button type="button" onClick={() => setIsOpen(false)} variant="secondary" size="sm">
                Cancel
              </Button>

              <form action={action}>
                {hiddenFields.map((field) => (
                  <input key={field.name} type="hidden" name={field.name} value={field.value} />
                ))}
                <Button type="submit" variant={confirmVariant} size="sm" className={confirmClassName}>
                  {confirmLabel}
                </Button>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}