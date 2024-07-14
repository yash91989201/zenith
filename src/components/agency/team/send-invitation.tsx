"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { InviteUserSchema } from "@/lib/schema";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { InviteUserType } from "@/lib/types";
import type { SubmitHandler } from "react-hook-form";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
// ICONS
import { Loader2 } from "lucide-react";

export function SendInvitation({
  agencyId,
  modalChild = false,
  onClose,
}: {
  agencyId: string;
  modalChild?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();

  const { mutateAsync: inviteUser } = api.admin.inviteUser.useMutation();
  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const inviteUserForm = useForm<InviteUserType>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      agencyId: agencyId ?? "",
      role: "SUBACCOUNT_USER",
    },
  });
  const { control, handleSubmit, formState } = inviteUserForm;

  const inviteUserAction: SubmitHandler<InviteUserType> = async (formData) => {
    const actionRes = await inviteUser(formData);
    if (actionRes.status === "SUCCESS") {
      await saveActivityLog({
        agencyId,
        activity: `Invited | ${formData.email}`,
      });
      toast.success(`Invited | ${formData.email}`);
      onClose?.();
      router.refresh();
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <Card className={cn(modalChild ? "border-none shadow-none" : "")}>
      <CardHeader className={cn(modalChild ? "p-3" : "")}>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an
          invitation sent out to their email, will not receive another
          invitation.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(modalChild ? "p-3" : "")}>
        <Form {...inviteUserForm}>
          <form
            onSubmit={handleSubmit(inviteUserAction)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="gap-3" disabled={formState.isSubmitting}>
              {formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              <span>Send Invitation</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
