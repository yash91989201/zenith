import "@/styles/globals.css";

import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}