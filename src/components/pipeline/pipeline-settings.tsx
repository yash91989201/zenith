"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// UTILS
import { wait } from "@/lib/utils";
import { api } from "@/trpc/react";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
// UI
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
import { Button } from "@ui/button";
import { Skeleton } from "@ui/skeleton";
// CUSTOM COMPONENTS
import { UpsertPipelineForm } from "@forms/upsert-pipeline-form";
// ICONS
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  pipelineId: string;
  subAccountId: string;
};

const PipelineSettings = ({ pipelineId, subAccountId }: Props) => {
  const apiUtils = api.useUtils();
  const router = useRouter();

  const deletePipelineModal = useToggle(false);
  const { data: pipelines = [], isLoading } =
    api.pipeline.getSubAccountPipelines.useQuery({ subAccountId });

  const { mutateAsync: deletePipeline, isPending: deletingPipeline } =
    api.pipeline.delete.useMutation();
  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const deletePipelineAction = async (pipelineId: string) => {
    const actionRes = await deletePipeline({ id: pipelineId });

    if (actionRes.status === "SUCCESS") {
      await saveActivityLog({
        subAccountId,
        activity: `Deleted Pipeline | ${pipelines.find((p) => p.id === pipelineId)?.name}`,
      });
      deletePipelineModal.close();

      void wait(1);
      toast.success(actionRes.message);
      await apiUtils.user.getNotifications.invalidate({ subAccountId });
      router.refresh();
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {isLoading ? (
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="space-y-1.5 p-6">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>

            <div className="space-y-6 p-6 pt-0">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ) : (
          <UpsertPipelineForm
            subAccountId={subAccountId}
            pipeline={pipelines.find((p) => p.id === pipelineId)}
          />
        )}
        <Button variant="destructive" onClick={deletePipelineModal.open}>
          Delete Pipeline
        </Button>
      </div>

      <AlertDialog
        open={deletePipelineModal.isOpen}
        onOpenChange={deletePipelineModal.toggle}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove pipeline data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="items-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({
                variant: "destructive",
                className: "gap-3",
              })}
              onClick={() => deletePipelineAction(pipelineId)}
            >
              {deletingPipeline && (
                <ReloadIcon className="size-4 animate-spin" />
              )}
              <span>Delete Pipeline</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PipelineSettings;
