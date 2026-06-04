import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jithin — Software Test Engineer & QA Specialist",
  description:
    "Freelance Software Test Engineer & QA Specialist delivering thorough manual and automated testing solutions that ensure quality.",
  openGraph: {
    title: "Jithin — Software Test Engineer & QA Specialist",
    description:
      "Freelance Software Test Engineer & QA Specialist delivering thorough manual and automated testing solutions.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="ancre">
      <body>
        {/* Font Awesome for social icons — Next hoists this link into <head> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        {children}
      </body>
    </html>
  );
}
