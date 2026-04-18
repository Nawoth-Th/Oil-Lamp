import type { Metadata } from "next";
import { Cinzel_Decorative, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

const notoSinhala = Noto_Serif_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "700"],
  variable: "--font-sinhala",
});

export const metadata: Metadata = {
  title: "Pol Thel Pahana - Segment",
  description:
    "Celebrate the Sri Lankan New Year 2026 by lighting the traditional Pol Thel Pahana together online. සුබ අලුත් අවුරුද්දක් වේවා!",
  keywords: ["Awrudu", "Sinhala New Year", "2026", "Oil Lamp", "Pahana", "Sri Lanka"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="si" className={`${cinzel.variable} ${notoSinhala.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
