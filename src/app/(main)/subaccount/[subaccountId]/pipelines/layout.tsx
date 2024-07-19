import React from "react";
// CUSTOM COMPONENT
import BlurPage from "@global/blur-page";

export default function PipelinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlurPage>{children}</BlurPage>;
}
