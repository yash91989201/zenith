"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { UpsertTicketSchema } from "@/lib/schema";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { UpsertTicketType } from "@/lib/types";
import type { SubmitHandler } from "react-hook-form";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Textarea } from "@ui/textarea";
import { Separator } from "@ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
// CUSTOM COMPONENTS
import { TagsForm } from "@/components/pipeline/tags-form";
import { TicketTagsForm } from "@/components/pipeline/ticket-tags-form";
// ICONS
import { ReloadIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown } from "lucide-react";

type Props = {
  laneId: string;
  subAccountId: string;
  modalChild?: boolean;
  onClose?: () => void;
  pipelineId: string;
};

export function UpsertTicketForm({
  laneId,
  pipelineId,
  modalChild,
  subAccountId,
  onClose,
}: Props) {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const [contact, setContact] = useDebounceValue("", 500);

  const { data: contacts = [] } = api.contact.getByName.useQuery(
    {
      name: contact,
    },
    {
      enabled: contact.length > 0,
    },
  );

  const { data: teamMembers = [], isLoading: fetchingTeamMembers } =
    api.subAccount.getTeamMembers.useQuery({
      id: subAccountId,
    });

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();
  const { mutateAsync: upsertTicket } = api.ticket.upsertTicket.useMutation();

  const ticketForm = useForm<UpsertTicketType>({
    resolver: zodResolver(UpsertTicketSchema),
    defaultValues: {
      ticket: {
        laneId,
      },
    },
  });

  const { control, handleSubmit, formState, setValue } = ticketForm;

  const upsertTicketAction: SubmitHandler<UpsertTicketType> = async (
    formData,
  ) => {
    const actionRes = await upsertTicket(formData);

    if (actionRes.status === "SUCCESS") {
      await apiUtils.lane.getDetail.refetch({ pipelineId });

      await saveActivityLog({
        subAccountId,
        activity: `Updated a ticket | ${formData.ticket.name}`,
      });
      await apiUtils.user.getNotifications.invalidate({ subAccountId });
      onClose?.();
      toast.success(actionRes.message);
      router.refresh();
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <Card className={cn(modalChild ? "border-none shadow-none" : "")}>
      {!modalChild && (
        <CardHeader className={cn(modalChild ? "p-0" : "")}>
          <CardTitle>Ticket</CardTitle>
          <CardDescription>Add ticket and tags</CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(modalChild ? "p-0" : "", "space-y-3")}>
        <Form {...ticketForm}>
          <form
            className="space-y-3"
            onSubmit={handleSubmit(upsertTicketAction)}
          >
            <FormField
              control={control}
              name="ticket.name"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ticket 1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="ticket.value"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? undefined}
                      placeholder="Ticket value"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="ticket.description"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none"
                      value={field.value ?? undefined}
                      placeholder="Describe your ticket"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TicketTagsForm subAccountId={subAccountId} />

            <FormField
              control={control}
              name="ticket.customerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Customer</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? contacts.find(
                                (contact) => contact.id === field.value,
                              )?.name
                            : "Select customer"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <Command>
                        <CommandInput
                          onValueChange={(value) => setContact(value)}
                          placeholder="Search customer..."
                        />
                        <CommandList>
                          <CommandEmpty>No customer found.</CommandEmpty>
                          <CommandGroup>
                            {contacts.map((contact) => (
                              <CommandItem
                                key={contact.id}
                                value={contact.name}
                                onSelect={() => {
                                  setValue("ticket.customerId", contact.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    contact.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {contact.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Ticket will be created for this customer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="ticket.assignedUserId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assign to team member</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? teamMembers.find(
                                (teamMember) => teamMember.id === field.value,
                              )?.name
                            : "Select team member"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>
                            No user found with this name.
                          </CommandEmpty>
                          <CommandGroup>
                            {fetchingTeamMembers && (
                              <p className="p-3 text-sm text-muted-foreground">
                                Fetching team members ...
                              </p>
                            )}
                            {teamMembers.map((teamMember) => (
                              <CommandItem
                                key={teamMember.id}
                                value={teamMember.name}
                                onSelect={() => {
                                  setValue(
                                    "ticket.assignedUserId",
                                    teamMember.id,
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    teamMember.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {teamMember.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Ticket will be assigned to this team member
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={formState.isSubmitting}>
              {formState.isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Saving ...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
        <Separator />
        <TagsForm />
      </CardContent>
    </Card>
  );
}
