"use client";
import * as Tabs from "@radix-ui/react-tabs";

export function SecurityTab() {
  return (
    <Tabs.Content className="w-full p-6" value="security">
      <h4 className="border-b p-4 pl-0 pt-0 font-bold lg:text-lg">Security</h4>
      <div className="flex items-start border-b p-4 pl-0">
        <h6 className="w-2/5 shrink-0 text-sm font-medium">Profile</h6>
        {/* user profile */}
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Password</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Passkeys</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Two-step verification</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Active devices</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b p-4 pl-0">
        <h6 className="w-2/5 text-sm font-medium">Delete account</h6>
        {/* user profile */}
        <div></div>
      </div>
    </Tabs.Content>
  );
}
