"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { UpsertSubAccountSchema } from "@/lib/schema";
// UTILS
import { wait } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type {
  AgencyType,
  UpsertSubAccountType,
  SubAccountType,
} from "@/lib/types";
import type { SubmitHandler } from "react-hook-form";
// UI
import { Button } from "@ui/button";
import { Card, CardContent } from "@ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { toast } from "@ui/use-toast";
import { PhoneInput } from "@ui/phone-input";
// CUSTOM COMOPNENTS
import { InstantImageUpload } from "@global/instant-image-upload";
// ICONS
import { ReloadIcon } from "@radix-ui/react-icons";
// CONSTANTS
import { MAX_FILE_SIZE } from "@/constants";

type SubAccountDetailsProps = {
  agencyDetails: AgencyType;
  details?: Partial<SubAccountType>;
  userId: string;
  userName: string;
  closeModal?: () => void;
};

export function SubAccountDetails({
  agencyDetails,
  details,
  userName,
  closeModal,
}: SubAccountDetailsProps) {
  const router = useRouter();

  const { mutateAsync: upsertSubAccount } =
    api.subAccount.upsertSubAccount.useMutation();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const agencyDetailsForm = useForm<UpsertSubAccountType>({
    defaultValues: details,
    resolver: zodResolver(UpsertSubAccountSchema),
  });

  const { control, handleSubmit, formState } = agencyDetailsForm;

  const subAccountDetailsSubmitAction: SubmitHandler<
    UpsertSubAccountType
  > = async (formData) => {
    const upsertSubAccountResponse = await upsertSubAccount({
      ...formData,
      agencyId: agencyDetails.id,
    });

    if (upsertSubAccountResponse.status === "SUCCESS") {
      await saveActivityLog({
        agencyId: agencyDetails.id,
        activity: `${userName} | updated sub account | ${formData.name}`,
        subAccountId: upsertSubAccountResponse?.data?.id,
      });

      toast({
        title: "Subaccount details saved",
        description: "Successfully saved your subaccount details.",
      });

      void wait(3);

      closeModal?.();
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Oppsie!",
        description: "Could not save sub account details.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <Form {...agencyDetailsForm}>
          <form
            className="my-3 space-y-3"
            onSubmit={handleSubmit(subAccountDetailsSubmitAction)}
          >
            <FormField
              control={control}
              name="subAccountLogo"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Sub account logo</FormLabel>
                  <FormControl>
                    <InstantImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      uploadEndpoint="/api/file/agency-logo"
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

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <FormLabel>Sub account name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Acme Co." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <FormLabel>Sub account email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="example@gmail.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Sub account number</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <FormField
                control={control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={formState.isLoading}>
              {formState.isLoading ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Saving ...
                </>
              ) : (
                "Save sub account information"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
