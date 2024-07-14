import { Unauthorized } from "@/components/global/unauthorized";
import { validateRequest } from "@/lib/auth";
import { verifyAndAcceptInvitation } from "@/server/helpers";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: {
    state?: string;
    code?: string;
  };
};

export default async function SubAccountMainPage({ searchParams }: PageProps) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/subaccount/unauthorized");
  }

  const agencyId = await verifyAndAcceptInvitation(user);

  if (!agencyId) {
    return redirect("/subaccount/unauthorized");
  }

  const userDetails = await api.user.getDetails({});

  const hasSubAccountPermission = userDetails?.permissions.find(
    (permission) => permission.access,
  );

  if (searchParams.state) {
    const statePath = searchParams.state?.split("___")[0];
    const stateSubAccountId = searchParams.state?.split("___")[1];
    if (!stateSubAccountId) {
      return <Unauthorized />;
    }
    return redirect(
      `/subaccount/${stateSubAccountId}/${statePath}?code=${searchParams.code}`,
    );
  }

  if (hasSubAccountPermission) {
    return redirect(`/subaccount/${hasSubAccountPermission.subAccountId}`);
  }

  return redirect("/subaccount/unauthorized");
}
