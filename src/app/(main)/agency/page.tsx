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

  if (!user || !session) {
    return redirect("/agency/sign-in");
  }

  const agencyId = await verifyAndAcceptInvitation(user);

  if (agencyId) {
    if (user.role === "SUBACCOUNT_GUEST" || user.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    }

    if (user.role === "AGENCY_ADMIN" || user.role === "AGENCY_OWNER") {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`,
        );
      }

      if (!searchParams.state) return redirect(`/agency/${agencyId}`);

      const [statePath, stateAgencyId] = searchParams.state.split("___");

      if (!stateAgencyId) {
        return <div>You are unauthorized to view this page.</div>;
      }

      return redirect(
        `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`,
      );
    }

    return redirect(`/agency/${agencyId}`);
  }

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="max-w-4xl space-y-6 p-4">
        <h1 className="text-4xl">Create An Agency</h1>
        <AgencyDetails data={{ companyEmail: user.email }} />
      </div>
    </div>
  );
}
