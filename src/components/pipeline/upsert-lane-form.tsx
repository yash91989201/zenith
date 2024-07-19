import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { LaneInsertSchema } from "@/lib/schema";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { LaneInsertType } from "@/lib/types";
import type { SubmitHandler } from "react-hook-form";
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
  lane?: LaneInsertType;
  subAccountId: string;
  pipelineId: string;
  modalChild?: boolean;
  onClose?: () => void;
};

export function UpsertLaneForm({
  lane,
  subAccountId,
  modalChild,
  pipelineId,
  onClose,
}: Props) {
  const apiUtils = api.useUtils();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const { mutateAsync: upsertLane } = api.lane.upsert.useMutation();

  const upsertLaneForm = useForm<LaneInsertType>({
    resolver: zodResolver(LaneInsertSchema),
    defaultValues: {
      ...lane,
      name: lane?.name ?? "",
      pipelineId,
    },
  });

  const { control, handleSubmit, formState } = upsertLaneForm;

  const upsertLaneAction: SubmitHandler<LaneInsertType> = async (formData) => {
    const actionRes = await upsertLane(formData);
    if (actionRes.status === "SUCCESS") {
      await apiUtils.lane.getDetail.refetch({ pipelineId });

      await saveActivityLog({
        subAccountId,
        activity: `${lane === undefined ? "Created new" : "Updated"} lane | ${formData.name}`,
      });

      await apiUtils.user.getNotifications.invalidate({ subAccountId });

      toast.success(actionRes.message);
      onClose?.();
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <Card className={cn(modalChild ? "border-none shadow-none" : "")}>
      {!modalChild && (
        <CardHeader className={cn(modalChild ? "p-0" : "")}>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(modalChild ? "p-0" : "")}>
        <Form {...upsertLaneForm}>
          <form className="space-y-3" onSubmit={handleSubmit(upsertLaneAction)}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="First lane" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="gap-3">
              {formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {lane === undefined ? "Create" : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
