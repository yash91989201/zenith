"use client";
import Image from "next/image";
import { toast } from "sonner";
// UTILS
import { api } from "@/trpc/react";
import { deleteFileFromStore } from "@/lib/utils";
// TYPES
import type { MediaType } from "@/lib/types";
// UI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Separator } from "@ui/separator";
// ICONS
import { Copy, MoreVertical, Trash } from "lucide-react";

export function MediaCard({ file }: { file: MediaType }) {
  const apiUtils = api.useUtils();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const deleteMediaAction = async () => {
    const success = await deleteFileFromStore(file.link, "/api/file/media");
    if (success) {
      await saveActivityLog({
        subAccountId: file.subAccountId,
        activity: `Deleted media file | ${file.name}`,
      });

      toast.success(`${file.name} media removed.`);

      await apiUtils.media.getSubAccountMedia.invalidate({
        subAccountId: file.subAccountId,
      });

      await apiUtils.user.getNotifications.invalidate({
        subAccountId: file.subAccountId,
      });
    } else {
      toast.error("Unable to delete media");
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="w-full overflow-hidden rounded-xl border dark:bg-slate-900">
          <div className="relative h-48 w-full bg-white">
            <Image
              src={file.link}
              alt="preview image"
              fill
              className="object-contain p-3"
            />
          </div>
          <Separator />
          <div className="relative bg-white p-3">
            <p className="text-base text-primary">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {file.createdAt.toDateString()}
            </p>
            <div className="absolute right-4 top-4 cursor-pointer">
              <DropdownMenuTrigger>
                <MoreVertical className="size-4 text-primary md:size-6" />
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                void navigator.clipboard.writeText(file.link);
                toast.success("Copied To Clipboard");
              }}
            >
              <Copy className="size-4" /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-3">
                <Trash className="size-4" /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive"
            onClick={deleteMediaAction}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
