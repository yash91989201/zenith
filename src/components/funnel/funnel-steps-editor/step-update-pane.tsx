"use client";
import Link from "next/link";
// UTILS
import { env } from "@/env";
// CUSTOM HOOKS
import { useFunnelSteps } from "@/hooks/useFunnelSteps";
// UI
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
// CUSTOM COMPONENTS
import { FunnelPageForm } from "@/components/funnel/funnel-page-form";
// ICONS
import { Icons } from "@global/icons";
import { Edit, ExternalLink } from "lucide-react";

export function StepUpdatePane() {
  const { currentPage, funnel } = useFunnelSteps();
  const { id: funnelId, subAccountId } = funnel;

  if (!currentPage) {
    return (
      <div className="flex h-[600px] items-center justify-center text-muted-foreground">
        Create or select a page to view page settings.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-sm text-muted-foreground">Page name</p>
        <CardTitle>{currentPage.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 w-full overflow-clip rounded-lg border-2 p-1.5 sm:w-80">
          <Link
            href={`/subaccount/${subAccountId}/funnels/${funnelId}/editor/${currentPage.id}`}
            className="group relative block w-full cursor-pointer hover:opacity-50"
          >
            {Icons.funnelPagePlaceholder}
            <Edit className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-100 group-hover:opacity-70" />
          </Link>
          <Link
            target="_blank"
            href={`${env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${env.NEXT_PUBLIC_DOMAIN}/${currentPage.pathName}`}
            className="flex items-start gap-1.5 p-1.5 transition-colors duration-200 hover:text-primary"
          >
            <ExternalLink className="size-4" />
            <div className="w-64 overflow-hidden overflow-ellipsis text-sm">
              {funnel.subDomainName}.{env.NEXT_PUBLIC_DOMAIN}/
              {currentPage.pathName}
            </div>
          </Link>
        </div>

        <FunnelPageForm
          modalChild
          funnelId={funnelId}
          subAccountId={subAccountId}
          funnelPage={currentPage}
        />
      </CardContent>
    </Card>
  );
}
