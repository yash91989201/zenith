"use client";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { UpsertFunnelSchema } from "@/lib/schema";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { FunnelInsertType, UpsertFunnelType } from "@/lib/types";
// UI
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
import { Textarea } from "@ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
// CUSTOM COMPONENTS
import { InstantImageUpload } from "@global/instant-image-upload";
// ICONS
import { Loader2 } from "lucide-react";
// CONSTANTS
import { MAX_FILE_SIZE } from "@/constants";

interface Props {
  funnel?: FunnelInsertType;
  subAccountId: string;
  modalChild?: boolean;
  onClose?: () => void;
}

export function FunnelForm({
  funnel,
  subAccountId,
  onClose,
  modalChild,
}: Props) {
  const router = useRouter();

  const { mutateAsync: upsertFunnel } = api.funnel.upsertFunnel.useMutation();

  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const funnelForm = useForm<UpsertFunnelType>({
    defaultValues: {
      ...funnel,
      subAccountId,
    },
    resolver: zodResolver(UpsertFunnelSchema),
  });

  const { control, handleSubmit, formState } = funnelForm;

  const upsertFormAction = async (formData: UpsertFunnelType) => {
    const actionRes = await upsertFunnel(formData);

    await saveActivityLog({
      subAccountId,
      activity: `Updated funnel | ${formData.name}`,
    });

    if (actionRes.status === "SUCCESS") {
      toast.success("Saved funnel details");
      onClose?.();
      router.refresh();
    } else {
      toast.success("Saved funnel details");
    }
  };

  return (
    <Card className={cn(modalChild ? "border-none shadow-none" : "")}>
      {!modalChild && (
        <CardHeader>
          <CardTitle>Funnel Details</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(modalChild ? "p-0" : "")}>
        <Form {...funnelForm}>
          <form
            onSubmit={handleSubmit(upsertFormAction)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none"
                      value={field.value ?? undefined}
                      placeholder="Tell us a little bit more about this funnel."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="subDomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub domain</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? undefined}
                      placeholder="Sub domain for funnel"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <InstantImageUpload
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      uploadEndpoint="/api/file/media"
                      className="min-h-64 border border-dashed bg-transparent shadow-none"
                      dropzoneOptions={{
                        maxSize: MAX_FILE_SIZE.API_ROUTE,
                        accept: {
                          "image/ico": [".ico"],
                        },
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-4 w-20"
              disabled={formState.isSubmitting}
              type="submit"
            >
              {formState.isSubmitting ? <Loader2 className="size-4" /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
