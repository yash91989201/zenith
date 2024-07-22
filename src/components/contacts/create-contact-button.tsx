"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { CreateContactSchema } from "@/lib/schema";
// UTILS
import { api } from "@/trpc/react";
// TYPE
import type { SubmitHandler } from "react-hook-form";
import type { CreateContactType, SubAccountType } from "@/lib/types";
// UI
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@ui/select";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
// ICONS
import { UserPlus } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  subAccounts: SubAccountType[];
};

export function CreateContactButton({ subAccounts }: Props) {
  const router = useRouter();
  const createContactForm = useForm<CreateContactType>({
    resolver: zodResolver(CreateContactSchema),
  });

  const { control, handleSubmit, formState } = createContactForm;

  const { mutateAsync: createContact } = api.contact.create.useMutation();

  const createContactAction: SubmitHandler<CreateContactType> = async (
    formData,
  ) => {
    const actionRes = await createContact(formData);
    if (actionRes.status === "SUCCESS") {
      router.refresh();
      toast.success(actionRes.message);
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1.5">
          <UserPlus className="size-4" />
          <span>Create Contact</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create contact</DialogTitle>
        </DialogHeader>
        <Form {...createContactForm}>
          <form
            onSubmit={handleSubmit(createContactAction)}
            className="space-y-3"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is contact&apos;s public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is contact&apos;s email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="subAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Account</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sub account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subAccounts.map((subAccount) => (
                        <SelectItem key={subAccount.id} value={subAccount.id}>
                          {subAccount.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a subaccount for this contact to be added to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="gap-1.5">
              {formState.isSubmitting && <ReloadIcon />}
              Save Contact
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
