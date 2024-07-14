import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { SubAccountType, UserType } from "@/lib/types";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
// UI
import { Switch } from "@ui/switch";
import { Separator } from "@ui/separator";
import { FormDescription, FormLabel } from "@ui/form";
import { Skeleton } from "@/components/ui/skeleton";

export function SubAccountsPermission({
  subAccounts,
  type,
  user,
}: {
  subAccounts?: SubAccountType[];
  type: "agency" | "subaccount";
  user: Partial<UserType>;
}) {
  const { user: currentUser } = useUser();
  const router = useRouter();

  const {
    data: userDetails,
    isLoading: userDetailsLoading,
    refetch: refetchUserDetails,
  } = api.user.getDetails.useQuery({
    id: user?.id,
  });

  const { mutateAsync: upsertPermission, isPending: upsertingPermission } =
    api.subAccount.upsertPermission.useMutation();

  const { mutateAsync: saveActivityLog, isPending: savingActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const changePermissionAction = async ({
    subAccountId,
    permission,
    subAccountName,
    permissionId,
  }: {
    subAccountId: string;
    subAccountName: string;
    permission: boolean;
    permissionId?: string;
  }) => {
    if (!user?.email) return;

    const upsertPermissionRes = await upsertPermission({
      permissionId,
      subAccountId,
      email: user.email,
      access: permission,
    });

    if (upsertPermissionRes.status === "FAILED") {
      toast.error(upsertPermissionRes.message);
      return;
    }

    toast.success("Sub account permission updated");
    await refetchUserDetails();

    if (type === "agency") {
      await saveActivityLog({
        agencyId: user?.agencyId ?? undefined,
        activity: `Gave access to ${user?.name} | ${subAccountName}`,
        subAccountId: subAccountId,
      });
    }

    router.refresh();
  };

  if (currentUser?.role !== "AGENCY_OWNER" || user.id === currentUser?.id) {
    return null;
  }

  if (userDetailsLoading)
    return (
      <div className="space-y-3">
        <Separator className="my-3" />
        <FormLabel>User permissions</FormLabel>
        <FormDescription>
          You can give sub account access to team member by turning on access
          control for each sub account. This is only visible to agency owners.
        </FormDescription>
        <div className="grid grid-cols-1 gap-3 @container @xl:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-4 w-full flex-1" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-4 w-full flex-1" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-3">
      <Separator className="my-3" />
      <FormLabel>User permissions</FormLabel>
      <FormDescription>
        You can give sub account access to team member by turning on access
        control for each sub account. This is only visible to agency owners.
      </FormDescription>
      <div className="grid grid-cols-1 gap-3 @container @xl:grid-cols-2">
        {subAccounts?.map((subAccount) => {
          const subAccountPermission = userDetails?.permissions.find(
            (permission) => permission.subAccountId === subAccount.id,
          );

          return (
            <div
              key={subAccount.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="relative h-10 w-24">
                <Image
                  src={subAccount.subAccountLogo}
                  alt="sub account logo"
                  fill
                />
              </div>
              <p className="flex-1 text-sm">{subAccount.name}</p>
              <Switch
                disabled={
                  userDetailsLoading || upsertingPermission || savingActivityLog
                }
                checked={subAccountPermission?.access}
                onCheckedChange={(permission) => {
                  void changePermissionAction({
                    subAccountId: subAccount.id,
                    permission,
                    permissionId: subAccountPermission?.id,
                    subAccountName: subAccount.name,
                  });
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
