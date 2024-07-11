"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { UpdateUserDetailsSchema } from "@lib/schema";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type {
  UserType,
  SubAccountType,
  UpdateUserDetailsType,
} from "@/lib/types";
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
// CUSTOM COMPONENTS
import { InstantImageUpload } from "@global/instant-image-upload";
import { SubAccountsPermission } from "@/components/forms/user-details/sub-accounts-permission";
// ICONS
import { Loader2 } from "lucide-react";
// CONSTANTS
import { MAX_FILE_SIZE } from "@/constants";

type UserDetailsProps = {
  type: "agency" | "subaccount";
  subAccounts?: SubAccountType[];
  userData: Partial<UserType>;
  id: string | null;
};

export function UserDetails({
  id,
  type,
  subAccounts,
  userData,
}: UserDetailsProps) {
  const { mutateAsync: updateById } = api.user.updateById.useMutation();

  const updateUserDetailsForm = useForm<UpdateUserDetailsType>({
    defaultValues: userData,
    resolver: zodResolver(UpdateUserDetailsSchema),
  });

  const { control, handleSubmit, formState, setError } = updateUserDetailsForm;

  const updateUserDetailsAction: SubmitHandler<UpdateUserDetailsType> = async (
    formData,
  ) => {
    if (!id) return;

    const updateByIdRes = await updateById({
      id,
      ...formData,
    });

    if (updateByIdRes.status === "SUCCESS") {
      toast.success(updateByIdRes.message);
    } else {
      toast.error(updateByIdRes.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User details</CardTitle>
        <CardDescription>update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...updateUserDetailsForm}>
          <form
            className="space-y-3"
            onSubmit={handleSubmit(updateUserDetailsAction)}
          >
            <FormField
              control={control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <InstantImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      uploadEndpoint="/api/file/profile"
                      className="min-h-64 border border-dashed bg-transparent shadow-none"
                      dropzoneOptions={{
                        maxSize: MAX_FILE_SIZE.API_ROUTE,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>User fullname</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>User email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@gmail.com"
                      type="email"
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="role"
              control={control}
              disabled={formState.isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (
                        ["SUBACCOUNT_USER", "SUBACCOUNT_GUEST"].includes(value)
                      ) {
                        setError("role", {
                          message:
                            "You need to have sub accounts to assign sub account access to team members",
                        });
                      }
                      field.onChange(value);
                    }}
                    disabled={field.value === "AGENCY_OWNER"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_OWNER">Agency owner</SelectItem>
                      <SelectItem value="AGENCY_ADMIN">Agency admin</SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Subaccount user
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Subaccount guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="gap-3" disabled={formState.isSubmitting}>
              {formState.isSubmitting && <Loader2 className="size-4" />}
              Save
            </Button>

            {subAccounts && subAccounts?.length > 0 && (
              <SubAccountsPermission subAccounts={subAccounts} type={type} />
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
