"use client";
// SCHEMAS
import { AgencyDetailsFormSchema } from "@/lib/schema";
// TYPES
import type { AgencyType } from "@/lib/types";
// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@ui/form";
import { PhoneInput } from "@ui/phone-input";
import AutoForm, { AutoFormSubmit } from "@ui/auto-form";
import type { AutoFormInputComponentProps } from "@ui/auto-form/types";

type AgencyDetailsProps = {
  data?: Partial<AgencyType>;
};

export function AgencyDetails({ data }: AgencyDetailsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agency information</CardTitle>
        <CardDescription>
          Let&apos;s create an agency for your business. You can edit agency
          settings later from the agency settings page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AutoForm
          formSchema={AgencyDetailsFormSchema}
          values={data}
          fieldConfig={{
            companyPhone: {
              fieldType: ({ field }: AutoFormInputComponentProps) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a valid phone number with country
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              ),
            },
          }}
        >
          <AutoFormSubmit>Submit</AutoFormSubmit>
        </AutoForm>
      </CardContent>
    </Card>
  );
}
