"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// SCHEMAS
import { CredsSignInSchema } from "@/lib/schema";
// UTILS
import { credsSignIn } from "@/server/actions/auth";
// TYPES
import type { CredsSignInType } from "@/lib/types";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
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
// CUSTOM COMPONENTS
import { AuthCardWrapper } from "@global/auth-card-wrapper";
// ICONS
import { Eye, EyeOff } from "lucide-react";

export function SignIn() {
  const router = useRouter();
  const showPasswordToggle = useToggle(false);

  const signInForm = useForm<CredsSignInType>({
    resolver: zodResolver(CredsSignInSchema),
  });
  const { control, handleSubmit, setError } = signInForm;

  const signInAction: SubmitHandler<CredsSignInType> = async (formData) => {
    const actionRes = await credsSignIn(formData);

    if (actionRes.status === "SUCCESS") {
      toast.success(actionRes.message);
      router.replace("/agency/sign-in");
    } else if (actionRes.status === "FAILED") {
      toast.error(actionRes.message);

      if (actionRes.errors?.email) {
        setError("email", { message: actionRes.errors.email });
      }
      if (actionRes.errors?.password) {
        setError("password", { message: actionRes.errors.password });
      }
    }
  };

  return (
    <AuthCardWrapper
      headerLabel="Sign In to Zenith"
      backButtonLabel="Don't have an account? Sign Up"
      backButtonHref="/agency/sign-up"
    >
      <Form {...signInForm}>
        <form onSubmit={handleSubmit(signInAction)} className="space-y-3">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3 [&>svg]:size-4 md:[&>svg]:size-5">
                    <Input
                      {...field}
                      type={showPasswordToggle.isOn ? "text" : "password"}
                      placeholder="********"
                    />
                    {showPasswordToggle.isOn ? (
                      <Eye
                        className="cursor-pointer select-none"
                        onClick={showPasswordToggle.off}
                      />
                    ) : (
                      <EyeOff
                        className="cursor-pointer select-none"
                        onClick={showPasswordToggle.on}
                      />
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="my-3 w-full">Sign In</Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
}
