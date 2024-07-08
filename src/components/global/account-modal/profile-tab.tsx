"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { zodResolver } from "@hookform/resolvers/zod";
// UTILS
import { api } from "@/trpc/react";
// SCHEMAS
import { UpdateUsernameSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { UpdateUsernameType } from "@/lib/types";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
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
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card";
// ICONS
import { Loader2 } from "lucide-react";

export function ProfileTab() {
  const { nameInitials, user } = useUser();
  const profileUpdateCard = useToggle(false);

  return (
    <Tabs.Content className="w-full p-6" value="profile">
      <h4 className="border-b p-4 pl-0 pt-0 font-bold lg:text-lg">
        Profile Details
      </h4>
      <div className="flex items-start border-b p-4 pl-0">
        <h6 className="w-2/5 shrink-0 text-sm font-medium">Profile</h6>
        {/* user profile */}
        {profileUpdateCard.isShowing ? (
          <ProfileUpdateCard
            username={user?.name ?? ""}
            hideCard={profileUpdateCard.hide}
          />
        ) : (
          <div className="flex flex-1 items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatarUrl} referrerPolicy="no-referrer" />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <span className="flex-1 text-sm font-medium">{user?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={profileUpdateCard.show}
            >
              Update profile
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Email addresses</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Phone numbers</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Connected accounts</h6>
        {/* user profile */}
        <div></div>
      </div>
    </Tabs.Content>
  );
}

const ProfileUpdateCard = ({
  username,
  hideCard,
}: {
  username: string;
  hideCard: () => void;
}) => {
  const router = useRouter();
  const updateUsernameForm = useForm<UpdateUsernameType>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      name: username,
    },
  });
  const { control, handleSubmit } = updateUsernameForm;
  const { mutateAsync: updateName, isPending } =
    api.user.updateName.useMutation();

  const updateUsernameAction: SubmitHandler<UpdateUsernameType> = async (
    formData,
  ) => {
    await updateName(formData);
    router.refresh();
    hideCard();
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3">
        <CardTitle className="text-xs">Update profile</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Form {...updateUsernameForm}>
          <form onSubmit={handleSubmit(updateUsernameAction)}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="justify-end gap-3 p-3">
              <Button variant="ghost" size="sm" onClick={hideCard}>
                Cancel
              </Button>
              <Button size="sm">
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
