"use client";
import { useRouter } from "next/navigation";
// UTILS
import { uploadAvatar } from "@/lib/utils";
import { api } from "@/trpc/react";
// SCHEMAS
import { UpdateUsernameSchema } from "@/lib/schema";
// TYPES
import type { UpdateUsernameType } from "@/lib/types";
// UI
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Button, buttonVariants } from "@ui/button";
import AutoForm, { AutoFormSubmit } from "@ui/auto-form";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
// ICONS
import { Loader2 } from "lucide-react";

export const ProfileUpdateCard = ({
  username,
  nameInitials,
  avatarUrl,
  hideCard,
}: {
  username?: string;
  nameInitials: string;
  avatarUrl: string;
  hideCard: () => void;
}) => {
  const router = useRouter();
  const { mutateAsync: updateName, isPending: isNameUpdating } =
    api.user?.updateName.useMutation();

  const { mutateAsync: updateAvatar, isPending: isAvatarUpdating } =
    api.user?.updateAvatar.useMutation();

  const updateUsernameAction = async (formData: UpdateUsernameType) => {
    const actionRes = await updateName(formData);
    if (actionRes.status === "SUCCESS") {
      router.refresh();
      hideCard();
    }
  };

  const updateAvatarAction = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (input?.files?.[0] && input?.files?.[0]?.size < 4 * 1024 * 1024) {
      const actionRes = await uploadAvatar(input.files[0]);
      if (actionRes.status === "SUCCESS") {
        router.refresh();
        hideCard();
      }
    }
  };

  const deleteAvatarAction = async () => {
    const actionRes = await updateAvatar({
      avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${username}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf&accessories=prescription01,prescription02,round,sunglasses&clothing=blazerAndSweater,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck,blazerAndShirt&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural,unibrowNatural,upDown,upDownNatural&eyes=default,happy,surprised&facialHair[]&mouth=default,smile&top=bigHair,bun,curly,curvy,dreads,dreads01,dreads02,frida,frizzle,fro,froBand,hat,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,shortCurly,shortFlat,shortRound,shortWaved,sides,straight01,straight02,straightAndStrand,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1`,
    });
    if (actionRes.status === "SUCCESS") {
      router.refresh();
      hideCard();
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">Update profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} className="size-12" />
            <AvatarFallback>{nameInitials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <span>
                <Label
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "cursor-pointer",
                  })}
                  htmlFor="avatar-image-upload"
                >
                  {isAvatarUpdating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Upload"
                  )}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple={false}
                  id="avatar-image-upload"
                  className="invisible h-0 w-0 p-0"
                  onChange={updateAvatarAction}
                />
              </span>
              <Button
                variant="link"
                size="sm"
                className="text-destructive hover:bg-red-50/75 hover:no-underline"
                onClick={deleteAvatarAction}
              >
                {isAvatarUpdating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Remove"
                )}
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">
              Recommended size 1:1, upto 4MB
            </span>
          </div>
        </div>
        <AutoForm
          formSchema={UpdateUsernameSchema}
          values={{
            name: username,
          }}
          onSubmit={updateUsernameAction}
        >
          <div className="flex items-center justify-end gap-3 p-3">
            <Button variant="ghost" size="sm" onClick={hideCard}>
              Cancel
            </Button>
            <AutoFormSubmit>
              {isNameUpdating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Save"
              )}
            </AutoFormSubmit>
          </div>
        </AutoForm>
      </CardContent>
    </Card>
  );
};
