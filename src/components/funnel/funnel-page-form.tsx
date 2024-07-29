"use client";
import { toast } from "sonner";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { zodResolver } from "@hookform/resolvers/zod";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { FunnelPageInsertType, UpsertFunnelPageType } from "@/lib/types";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/tooltip";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
// CUSTOM HOOKS
import { UpsertFunnelPageSchema } from "@/lib/schema";
// ICONS
import { ReloadIcon } from "@radix-ui/react-icons";
import { CopyPlusIcon, Loader2, Trash } from "lucide-react";

interface Props {
  funnelPage?: FunnelPageInsertType;
  funnelId: string;
  subAccountId: string;
  modalChild?: boolean;
  onClose?: () => void;
}

export const FunnelPageForm = memo(
  ({
    funnelPage,
    funnelId,
    subAccountId,
    modalChild = false,
    onClose,
  }: Props) => {
    const router = useRouter();

    const { mutateAsync: saveActivityLog } =
      api.notification.saveActivityLog.useMutation();

    const { mutateAsync: deleteFunnelPage, isPending: deletingFunnelPage } =
      api.funnelPage.delete.useMutation();

    const {
      mutateAsync: upsertFunnelPage,
      isPending: upsertingFunnelPage,
      variables: upsertFunnelPageVariables,
    } = api.funnelPage.upsert.useMutation();

    const upsertFunnelPageForm = useForm<UpsertFunnelPageType>({
      resolver: zodResolver(UpsertFunnelPageSchema),
      defaultValues: {
        funnelId,
        funnelPage: {
          ...funnelPage,
          funnelId,
        },
      },
    });

    const { control, formState, handleSubmit, reset } = upsertFunnelPageForm;

    useEffect(() => {
      if (funnelPage) {
        reset({
          funnelId,
          funnelPage: {
            ...funnelPage,
            funnelId,
          },
        });
      }
    }, [funnelId, funnelPage, reset]);

    const upsertFunnelPageAction = async (formData: UpsertFunnelPageType) => {
      const actionRes = await upsertFunnelPage(formData);

      if (actionRes.status === "SUCCESS") {
        await saveActivityLog({
          subAccountId,
          activity: `Updated a funnel page | ${formData.funnelPage.name}`,
        });

        onClose?.();
        router.refresh();
        toast.success(actionRes.message);
      } else {
        toast.error(actionRes.message);
      }
    };

    const copyFunnelPageAction = async () => {
      if (!funnelPage) return;

      const actionRes = await upsertFunnelPage({
        funnelId,
        funnelPage: {
          ...funnelPage,
          id: createId(),
          name: `${funnelPage.name} Copy`,
          pathName: `${funnelPage.pathName}copy`,
        },
      });

      if (actionRes.status === "SUCCESS") {
        await saveActivityLog({
          subAccountId,
          activity: `Copied a funnel page | ${funnelPage.name}`,
        });

        router.refresh();
        toast.success(actionRes.message);
      } else {
        toast.error(actionRes.message);
      }
    };

    const deleteFunnelPageAction = async () => {
      if (!funnelPage) return;
      if (!funnelPage?.id) return;

      const actionRes = await deleteFunnelPage({ funnelPageId: funnelPage.id });
      if (actionRes.status === "SUCCESS") {
        await saveActivityLog({
          activity: `Delete funnel page | ${funnelPage?.name}`,
          subAccountId,
        });

        router.refresh();
        toast.success(actionRes.message);
      } else {
        toast.error(actionRes.message);
      }
    };

    const disableButton =
      deletingFunnelPage || formState.isSubmitting || upsertingFunnelPage;

    const copyFunnelPageLoading =
      upsertingFunnelPage &&
      upsertFunnelPageVariables?.funnelPage.id !== funnelPage?.id;

    return (
      <Card className={cn(modalChild ? "border-none shadow-none" : "")}>
        {!modalChild && (
          <CardHeader>
            <CardTitle>Funnel Page</CardTitle>
            <CardDescription>
              Funnel pages are flow in the order they are created by default.
              You can move them around to change their order.
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={cn(modalChild ? "p-0" : "")}>
          <Form {...upsertFunnelPageForm}>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(upsertFunnelPageAction)}
            >
              <FormField
                disabled={formState.isSubmitting}
                control={control}
                name="funnelPage.name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Name"
                        value={field.value ?? undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={formState.isSubmitting}
                control={control}
                name="funnelPage.pathName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Path Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Path for the page"
                        {...field}
                        value={
                          field.value !== null && field.value !== undefined
                            ? field.value.toLowerCase()
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button
                  className="gap-1.5"
                  disabled={disableButton || !formState.isDirty}
                >
                  {formState.isSubmitting && (
                    <ReloadIcon className="size-4 animate-spin" />
                  )}
                  {funnelPage ? "Update funnel page" : "Create funnel page"}
                </Button>

                <TooltipProvider delayDuration={300}>
                  {funnelPage?.id && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          type="button"
                          variant="outline"
                          disabled={disableButton}
                          onClick={copyFunnelPageAction}
                        >
                          {copyFunnelPageLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <CopyPlusIcon className="size-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy funnel page</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>

                {funnelPage?.id && (
                  <Button
                    size="icon"
                    type="button"
                    variant="destructive"
                    disabled={disableButton}
                    onClick={deleteFunnelPageAction}
                  >
                    {deletingFunnelPage ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash className="size-4" />
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  },
);

FunnelPageForm.displayName = "Funnel Page From";
