"use client";
// SCHEMAS
import { AddEmailSchema } from "@/lib/schema";
// TYPES
import type { AddEmailType } from "@/lib/types";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Button } from "@ui/button";
import AutoForm, { AutoFormSubmit } from "@ui/auto-form";
// ICONS
import { Loader2 } from "lucide-react";

export const AddEmailAddressCard = ({ hideCard }: { hideCard: () => void }) => {
  const addEmailAction = (formData: AddEmailType) => {
    console.log(formData.email);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">Add email address</CardTitle>
        <CardDescription className="text-xs">
          An email containing a verification code will be sent to this email
          address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-3">
        <AutoForm formSchema={AddEmailSchema} onSubmit={addEmailAction}>
          <div className="flex items-center justify-end gap-3 p-3">
            <Button variant="ghost" size="sm" onClick={hideCard}>
              Cancel
            </Button>
            <AutoFormSubmit>
              {3 < 2 ? <Loader2 className="size-4 animate-spin" /> : "Add"}
            </AutoFormSubmit>
          </div>
        </AutoForm>
      </CardContent>
    </Card>
  );
};
