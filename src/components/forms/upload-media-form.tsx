"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { SaveMediaDataSchema } from "@/lib/schema";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { SaveMediaDataType } from "@/lib/types";
import type { SubmitHandler } from "react-hook-form";
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
// CUSTOM COMPONENT
import { InstantImageUpload } from "@global/instant-image-upload";
// ICONS
import { Loader2 } from "lucide-react";
// CONSTANTS
import { MAX_FILE_SIZE } from "@/constants";

export function UploadMediaForm({
  subAccountId,
  modalChild,
  onClose,
}: {
  modalChild?: boolean;
  onClose?: () => void;
  subAccountId: string;
}) {
  const apiUtils = api.useUtils();

  const { mutateAsync: saveMediaData, isPending: savingMediaData } =
    api.media.saveMediaData.useMutation();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const uploadMediaForm = useForm<SaveMediaDataType>({
    resolver: zodResolver(SaveMediaDataSchema),
    defaultValues: {
      subAccountId,
      type: "image",
      link: "",
    },
  });

  const { control, handleSubmit, formState } = uploadMediaForm;

  const uploadMediaAction: SubmitHandler<SaveMediaDataType> = async (
    formData,
  ) => {
    const actionRes = await saveMediaData(formData);
    if (actionRes.status === "SUCCESS") {
      await saveActivityLog({
        subAccountId,
        activity: `Added media file`,
      });

      await apiUtils.media.getSubAccountMedia.invalidate({ subAccountId });
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
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>
            Upload a file to your media bucket. Uploading media here will make
            it available globally
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(modalChild ? "p-0" : "")}>
        <Form {...uploadMediaForm}>
          <form
            className="space-y-3"
            onSubmit={handleSubmit(uploadMediaAction)}
          >
            <FormField
              control={control}
              name="link"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>Media</FormLabel>
                  <FormControl>
                    <InstantImageUpload
                      value={field.value}
                      disabled={savingMediaData}
                      onChange={field.onChange}
                      uploadEndpoint="/api/file/media"
                      className="min-h-64 border border-dashed bg-transparent shadow-none"
                      dropzoneOptions={{
                        maxSize: MAX_FILE_SIZE.API_ROUTE,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full sm:flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Image name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full gap-3">
              {formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              <span>Save</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
