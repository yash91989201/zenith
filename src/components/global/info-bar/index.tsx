// CUSTOM COMPONENTS
import { ThemeToggle } from "@global/theme-toggle";
import { UserButton } from "@global/user-button";
import { NotificationButton } from "@global/info-bar/notification-button";

export function InfoBar({ subAccountId }: { subAccountId?: string }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-20 flex items-center gap-4 border-b-[1px] bg-background/80 p-4 backdrop-blur-md md:left-[300px] ">
      <div className="ml-auto flex items-center gap-3">
        <UserButton />
        <NotificationButton subAccountId={subAccountId} />
        <ThemeToggle />
      </div>
    </div>
  );
}
