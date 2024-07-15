"use client";
// UTILS
import { api } from "@/trpc/react";
// UI
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
// CUSTOM COMPONENTS
import { UploadMediaButton } from "@/components/sub-account/media/upload-media-button";
import { MediaCard } from "@/components/sub-account/media/media-card";
import { FolderSearch } from "lucide-react";

type Props = {
  subAccountId: string;
};

export function MediaComponent({ subAccountId }: Props) {
  const { data } = api.media.getSubAccountMedia.useQuery({
    subAccountId,
  });

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Media Bucket</h1>
        <UploadMediaButton subAccountId={subAccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="max-h-full pb-40 ">
          <CommandEmpty>No Media Files</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.media.map((file) => (
                <CommandItem
                  key={file.id}
                  className="w-full max-w-80 rounded-lg bg-transparent p-0 font-medium text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.media.length && (
                <div className="flex w-full flex-col items-center justify-center">
                  <FolderSearch className="size-80 text-slate-300 dark:text-muted" />
                  <p className="text-muted-foreground ">
                    Empty! no files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
