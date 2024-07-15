"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
// CUSTOM COMPONENTS
import { UploadMediaForm } from "@forms/upload-media-form";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToggle } from "@/hooks/use-toggle";

export function UploadMediaButton({ subAccountId }: { subAccountId: string }) {
  const uploadMediaDialog = useToggle();

  return (
    <Dialog
      open={uploadMediaDialog.isOpen}
      onOpenChange={uploadMediaDialog.toggle}
    >
      <DialogTrigger className={buttonVariants({ className: "gap-3" })}>
        <Plus className="size-4" />
        <span>Upload Media</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload a file to your media bucket. Uploading media here will make
            it available globally
          </DialogDescription>
        </DialogHeader>
        <UploadMediaForm
          modalChild
          onClose={uploadMediaDialog.close}
          subAccountId={subAccountId}
        />
      </DialogContent>
    </Dialog>
  );
}
