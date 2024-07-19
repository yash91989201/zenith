import { Command as CommandPrimitive } from "cmdk";
import { useFieldArray, useFormContext } from "react-hook-form";
// UTILS
import { api } from "@/trpc/react";
// TYPE
import type { TagColor, UpsertTicketType } from "@/lib/types";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
// UI
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Label } from "@ui/label";
import { Tag } from "@global/tag";
// ICONS
import { X } from "lucide-react";
import { FormMessage } from "@ui/form";

type Props = {
  subAccountId: string;
};

export function TicketTagsForm({ subAccountId }: Props) {
  const tagsDD = useToggle(false);

  const { data: tags = [], isLoading: gettingAllTags } =
    api.tag.getAll.useQuery({
      subAccountId,
    });

  const { control } = useFormContext<UpsertTicketType>();
  const { fields, append, remove } = useFieldArray({
    keyName: "field_id",
    control,
    name: "tags",
  });

  const availableTags = tags.filter(
    (tag) => !fields.map((field) => field.name).includes(tag.name),
  );

  return (
    <Command className="space-y-3 overflow-visible bg-transparent">
      <Label>Select tags</Label>
      <div className="group rounded-md border border-input px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-ring">
        <div className="flex flex-wrap gap-1">
          {fields.map((field, index) => {
            return (
              <Tag
                colorName={field.color as TagColor}
                title={field.name}
                key={field.field_id}
              >
                <button
                  className="ml-2 rounded outline-none ring-offset-background focus:ring-1 focus:ring-ring"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      remove(index);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => remove(index)}
                >
                  <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </Tag>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            onBlur={tagsDD.close}
            onFocus={tagsDD.open}
            placeholder="Select tags..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {tagsDD.isOpen && availableTags.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                <CommandEmpty>No tags available.</CommandEmpty>
                {gettingAllTags && (
                  <CommandItem>Fetching available tags.</CommandItem>
                )}
                {availableTags.map((tag) => (
                  <CommandItem
                    key={tag.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => append(tag)}
                    className="cursor-pointer"
                  >
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
      <FormMessage />
    </Command>
  );
}
