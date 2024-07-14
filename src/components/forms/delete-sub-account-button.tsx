"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { wait } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function DeleteSubAccountButton({
  subAccountId,
}: {
  subAccountId: string;
}) {
  const { user } = useUser();
  const router = useRouter();

  const { data: subAccount } = api.subAccount.getById.useQuery({
    id: subAccountId,
  });

  const { mutateAsync: deleteSubAccount } =
    api.subAccount.deleteSubAccount.useMutation();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const deleteSubAccountAction = async () => {
    if (!subAccount || !user) return;

    const deleteSubAccountRes = await deleteSubAccount({ id: subAccountId });
    if (deleteSubAccountRes.status === "SUCCESS") {
      await saveActivityLog({
        subAccountId,
        activity: `Deleted '${subAccount.name}' sub account | ${user.name}`,
      });
      void wait(1);
      router.refresh();
    }
  };

  return (
    <Button variant="destructive" onClick={deleteSubAccountAction}>
      Delete Sub Account
    </Button>
  );
}
