import { toast } from "sonner";
import { useRouter } from "next/navigation";
// UTILS
import { wait } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { SubAccountType } from "@/lib/types";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
// UI
import { Switch } from "@ui/switch";
import { Separator } from "@ui/separator";
import { FormDescription, FormLabel } from "@ui/form";

export function SubAccountsPermission({
  subAccounts,
  type,
}: {
  subAccounts?: SubAccountType[];
  type: "agency" | "subaccount";
}) {
  const { user } = useUser();
  const router = useRouter();

  const { data: userDetails, isLoading: userDetailsLoading } =
    api.user.getDetails.useQuery();

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

    if ((upsertPermissionRes.status = "FAILED")) {
      toast.error("Unable to update permission");
      return;
    }

    toast.success("Sub account permission updated");

    if (type === "agency") {
      await saveActivityLog({
        agencyId: user?.agencyId ?? undefined,
        activity: `Gave access to ${user?.name} | ${subAccountName}`,
        subAccountId: subAccountId,
      });
    }

    void wait(2);
    router.refresh();
  };

  if (userDetailsLoading) return null;

  if (user?.role !== "AGENCY_OWNER") return null;

  return (
    <div className="space-y-2">
      <Separator className="my-3" />
      <FormLabel>User permissions</FormLabel>
      <FormDescription>
        You can give sub account access to team member by turning on access
        control for each sub account. This is only visible to agency owners.
      </FormDescription>
      <div className="flex flex-col gap-3">
        {subAccounts?.map((subAccount) => {
          const subAccountPermission = userDetails?.permissions.find(
            (permission) => permission.subAccountId === subAccount.id,
          );

          return (
            <div
              key={subAccount.id}
              className="flex flex-col items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div>
                <p>{subAccount.name}</p>
                <Switch
                  disabled={
                    userDetailsLoading ||
                    upsertingPermission ||
                    savingActivityLog
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
