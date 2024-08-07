"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { UpsertAgencySchema } from "@/lib/schema";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type {
  UpsertAgencyType,
  AgencyType,
  StripeCustomerType,
} from "@/lib/types";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Switch } from "@ui/switch";
import { toast } from "sonner";
import { PhoneInput } from "@ui/phone-input";
import { NumberInput } from "@ui/number-input";
// CUSTOM COMOPNENTS
import { InstantImageUpload } from "@global/instant-image-upload";
// ICONS
import { ReloadIcon } from "@radix-ui/react-icons";
// CONSTANTS
import { MAX_FILE_SIZE } from "@/constants";

type AgencyDetailsProps = {
  data?: Partial<AgencyType>;
};

export function AgencyDetails({ data }: AgencyDetailsProps) {
  const router = useRouter();
  const deleteAgencyDialog = useToggle(false);
  const apiUtils = api.useUtils();

  const { mutateAsync: deleteAgency, isPending: deletingAgency } =
    api.agency.deleteAgency.useMutation();

  const { mutateAsync: createCustomer } =
    api.stripe.createCustomer.useMutation();

  const { mutateAsync: updateAgencyGoal, isPending: updatingAgency } =
    api.agency.updateAgencyGoal.useMutation();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const { mutateAsync: initUser } = api.agency.initUser.useMutation();
  const { mutateAsync: upsertAgency } = api.agency.upsertAgency.useMutation();

  const agencyDetailsForm = useForm<UpsertAgencyType>({
    defaultValues: data,
    resolver: zodResolver(UpsertAgencySchema),
  });

  const { control, handleSubmit, formState } = agencyDetailsForm;

  const agencyDetailsSubmitAction: SubmitHandler<UpsertAgencyType> = async (
    formData,
  ) => {
    let customerId: string | undefined;

    if (!data?.id) {
      const createCustomerData: StripeCustomerType = {
        email: formData.companyEmail,
        name: formData.name,
        shipping: {
          address: {
            city: formData.city,
            country: formData.country,
            line1: formData.address,
            postal_code: formData.zipCode,
            state: formData.zipCode,
          },
          name: formData.name,
        },
        address: {
          city: formData.city,
          country: formData.country,
          line1: formData.address,
          postal_code: formData.zipCode,
          state: formData.zipCode,
        },
      };
      const actionRes = await createCustomer(createCustomerData);
      if (actionRes.status === "SUCCESS") {
        customerId = actionRes.data?.customerId;
      }
    }

    if (!data?.id) {
      await initUser({ role: "AGENCY_OWNER" });
    }

    if (!data?.customerId && !customerId) return;

    const actionRes = await upsertAgency({
      ...formData,
      id: data?.id,
      price: null,
      customerId,
    });

    if (actionRes.status === "SUCCESS") {
      toast.success(actionRes.message);
      router.refresh();
    } else {
      toast.error(actionRes.message);
    }
  };

  const updateAgencyGoalAction = async (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!data?.id) return;
    const actionRes = await updateAgencyGoal({
      goal: Number(evt.target.value),
      agencyId: data.id,
    });

    if (actionRes.status === "SUCCESS") {
      await saveActivityLog({
        agencyId: data.id,
        activity: `Updated the agency goal to | ${evt.target.value} Sub Account`,
      });
      toast.success(actionRes.message);

      await apiUtils.user.getNotifications.invalidate();
      router.refresh();
    } else {
      toast.error(actionRes.message);
    }
  };

  const deleteAgencyAction = async (agencyId?: string) => {
    if (!agencyId) return;

    const actionRes = await deleteAgency({ agencyId });
    if (actionRes.status === "SUCCESS") {
      toast.success(actionRes.message);
      router.refresh();
    } else if (actionRes.status === "FAILED") {
      toast.error(actionRes.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agency information</CardTitle>
        <CardDescription>
          Let&apos;s create an agency for your business. You can edit agency
          settings later from the agency settings page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...agencyDetailsForm}>
          <form
            className="space-y-3"
            onSubmit={handleSubmit(agencyDetailsSubmitAction)}
          >
            <FormField
              control={control}
              name="agencyLogo"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Agency logo</FormLabel>
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
                    <FormLabel>Agency name</FormLabel>
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
                    <FormLabel>Agency email</FormLabel>
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
                  <FormLabel>Agency number</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="whiteLabel"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Whitelabel agency
                    </FormLabel>
                    <FormDescription>
                      Turning on whitelabel model will show your agency logo to
                      all sub accounts by default. You can overwrite this
                      functionality through sub account settings
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
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

            {data?.id && (
              <div className="flex flex-col gap-3 sm:w-full md:w-1/2 ">
                <FormLabel>Agency Goal</FormLabel>
                <FormDescription>
                  ✨ Create a goal for your agency. As your business grows your
                  goals grow too so dont forget to set the bar higher!
                </FormDescription>
                <NumberInput
                  value={data?.goal}
                  disabled={updatingAgency}
                  onChange={updateAgencyGoalAction}
                  min={1}
                  placeholder="Sub Account Goal"
                />
              </div>
            )}

            <Button disabled={formState.isSubmitting}>
              {formState.isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Saving ...
                </>
              ) : (
                "Save agency information"
              )}
            </Button>
          </form>
        </Form>
        {data?.id && (
          <>
            <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-lg border border-destructive p-4">
              <h4 className="shrink-0 font-bold">Danger Zone</h4>
              <div className="text-muted-foreground">
                Deleting your agency cannot be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>
              <Button
                disabled={formState.isLoading || deletingAgency}
                onClick={deleteAgencyDialog.open}
                variant="destructive"
              >
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </Button>
            </div>

            <AlertDialog
              open={deleteAgencyDialog.isOpen}
              onOpenChange={deleteAgencyDialog.toggle}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-left">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    This action cannot be undone. This will permanently delete
                    the Agency account and all related sub accounts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deletingAgency}
                    className="bg-destructive hover:bg-destructive"
                    onClick={() => deleteAgencyAction()}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}
