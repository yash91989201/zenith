import { redirect } from "next/navigation";
// UTILS
import { validateRequest } from "@/lib/auth";
import { verifyAndAcceptInvitation } from "@/server/helpers";
// CUSTOM COMPONENTS
import { AgencyDetails } from "@forms/agency-details";

export default async function AgencyPage({
  searchParams,
}: {
  searchParams: { plan?: string; state?: string; code?: string };
}) {
  const { user, session } = await validateRequest();

  if (!user || !session) return redirect("/agency/sign-in");

  const agencyId = await verifyAndAcceptInvitation(user);

  if (agencyId) {
    if (user.role === "SUBACCOUNT_GUEST" || user.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user.role === "AGENCY_ADMIN" || user.role === "AGENCY_OWNER") {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`,
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        if (!stateAgencyId) return <div> un authorized </div>;
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`,
        );
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return redirect(`/agency/${agencyId}`);
    }
  }

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="max-w-[850px] rounded-xl border-[1px] p-4">
        <h1 className="text-4xl"> Create An Agency</h1>
        <AgencyDetails data={{ companyEmail: user.email }} />
      </div>
    </div>
  );
}
