"use client";
import * as Tabs from "@radix-ui/react-tabs";

export function SecurityTab() {
  return (
    <Tabs.Content
      className="w-full p-6 dark:bg-dark-tremor-background-subtle"
      value="security"
    >
      <h4 className="border-b py-6 font-bold dark:border-gray-400 lg:text-lg">
        Security
      </h4>
      <div className="flex items-start border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 shrink-0 text-sm font-medium">Profile</h6>
        {/* user profile */}
      </div>
      <div className="flex items-center border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 text-sm font-medium">Password</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 text-sm font-medium">Passkeys</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 text-sm font-medium">Two-step verification</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 text-sm font-medium">Active devices</h6>
        {/* user profile */}
        <div></div>
      </div>
      <div className="flex items-center border-b py-6 dark:border-gray-400">
        <h6 className="w-2/5 text-sm font-medium">Delete account</h6>
        {/* user profile */}
        <div></div>
      </div>
    </Tabs.Content>
  );
}
