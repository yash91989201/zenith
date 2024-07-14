export default function SubAccountPage({
  params,
}: {
  params: { subaccountId: string };
}) {
  return <>{params.subaccountId}</>;
}
