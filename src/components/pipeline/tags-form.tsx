import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { TagInsertSchema } from "@/lib/schema";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { TagInsertType } from "@/lib/types";
import type { SubmitHandler } from "react-hook-form";
// UI
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Label } from "@ui/label";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/form";
// CUSTOM COMPONENTS
import { Tag } from "@global/tag";
// ICONS
import { PlusCircle } from "lucide-react";

type Props = {
  subAccountId?: string;
};

export function TagsForm(props: Props) {
  const apiUtils = api.useUtils();
  const params = useParams<{ subaccountId: string; pipelineId: string }>();

  const subAccountId = params.subaccountId || props.subAccountId;

  const { mutateAsync: createTag } = api.tag.create.useMutation();
  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const tagsForm = useForm<TagInsertType>({
    resolver: zodResolver(TagInsertSchema),
    defaultValues: {
      subAccountId,
      color: "BLUE",
      name: "",
    },
  });
  const { control, handleSubmit, formState, reset } = tagsForm;

  const createTagAction: SubmitHandler<TagInsertType> = async (formData) => {
    if (subAccountId === undefined) return;
    const actionRes = await createTag({
      ...formData,
      subAccountId,
    });

    if (actionRes.status === "SUCCESS") {
      await saveActivityLog({
        subAccountId,
        activity: `Added new tag | ${formData.name}`,
      });

      reset();

      toast.success(actionRes.message);
      await apiUtils.tag.getAll.invalidate();
      await apiUtils.user.getNotifications.invalidate({ subAccountId });
    } else {
      toast.error(actionRes.message);
    }
  };

  return (
    <Form {...tagsForm}>
      <form className="space-y-3" onSubmit={handleSubmit(createTagAction)}>
        <Label>Create new tag</Label>
        <div className="flex items-end gap-3">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full sm:flex-1">
                <FormControl>
                  <Input {...field} placeholder="New tag" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BLUE">
                      <Tag colorName="BLUE" />
                    </SelectItem>
                    <SelectItem value="ORANGE">
                      <Tag colorName="ORANGE" />
                    </SelectItem>
                    <SelectItem value="ROSE">
                      <Tag colorName="ROSE" />
                    </SelectItem>
                    <SelectItem value="PURPLE">
                      <Tag colorName="PURPLE" />
                    </SelectItem>
                    <SelectItem value="GREEN">
                      <Tag colorName="GREEN" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            disabled={formState.isSubmitting || !formState.isValid}
          >
            <PlusCircle className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
