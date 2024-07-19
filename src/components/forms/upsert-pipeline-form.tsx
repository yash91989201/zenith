import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
// SCHEMAS
import { UpsertPipelineFormSchema } from "@/lib/schema";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { UpsertPipelineFormType, PipelineType } from "@/lib/types";
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
import { Input } from "@ui/input";
import { Button } from "@ui/button";
// ICONS
import { Loader2 } from "lucide-react";

type Props = {
  pipeline?: PipelineType;
  subAccountId: string;
  modalChild?: boolean;
  onClose?: () => void;
};

export function UpsertPipelineForm({
  pipeline,
  subAccountId,
  modalChild,
  onClose,
}: Props) {
  const router = useRouter();
  const apiUtils = api.useUtils();

  const { mutateAsync: upsertPipeline } = api.pipeline.upsert.useMutation();
  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const UpsertPipelineForm = useForm<UpsertPipelineFormType>({
    resolver: zodResolver(UpsertPipelineFormSchema),
    defaultValues: {
      name: pipeline?.name,
    },
  });

  const { control, handleSubmit, formState } = UpsertPipelineForm;

  const upsertPipelineAction: SubmitHandler<UpsertPipelineFormType> = async (
    formData,
  ) => {
    const actionRes = await upsertPipeline({
      id: pipeline?.id,
      name: formData.name,
      subAccountId,
    });

    if (actionRes.status === "SUCCESS") {
      await saveActivityLog({
        subAccountId,
        activity: `Updated pipeline | ${formData.name}`,
      });

      await apiUtils.user.getNotifications.invalidate({ subAccountId });

      toast.success(actionRes.message);
      router.refresh();
      onClose?.();
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <Card className={cn(modalChild ? "border-none p-0 shadow-none" : "")}>
      {!!modalChild ? (
        <VisuallyHidden.Root>
          <CardHeader>
            <CardTitle>Create or update Pipeline</CardTitle>
            <CardDescription>
              Create pipeline and add funnels to it or update pipelines
            </CardDescription>
          </CardHeader>
        </VisuallyHidden.Root>
      ) : (
        <CardHeader className={cn(modalChild ? "p-0" : "")}>
          <CardTitle>
            {pipeline === undefined ? "Create Pipeline" : "Update Pipeline"}
          </CardTitle>
          <CardDescription>Pipeline Details</CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(modalChild ? "p-0" : "")}>
        <Form {...UpsertPipelineForm}>
          <form
            className="space-y-6"
            onSubmit={handleSubmit(upsertPipelineAction)}
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={formState.isSubmitting}>
              {formState.isSubmitting && <Loader2 />}
              {pipeline === undefined ? "Create" : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
