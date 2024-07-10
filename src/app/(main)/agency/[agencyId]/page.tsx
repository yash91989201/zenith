export default function AgencyPage({
  params,
}: {
  params: { agencyId: string };
}) {
  return <>{params.agencyId}</>;
}
