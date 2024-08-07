import "@/styles/globals.css";

import { DM_Sans } from "next/font/google";
// PROVIDERS
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@providers/theme-provider";
// UI
import { Toaster } from "@ui/sonner";

export const metadata = {
  title: "Zenith",
  description: "All in one agency solution",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const DM_Sans_Font = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={DM_Sans_Font.className} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
        <Toaster richColors theme="light" />
      </body>
    </html>
  );
}
