import { Suspense, type CSSProperties, type ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Vazirmatn } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { ScrollToTop } from "@/components/chrome/scroll-to-top";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-fa",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: resolved, namespace: "Metadata" });

  return {
    title: {
      default: t("title"),
      template: "%s · F1Lab",
    },
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const direction = locale === "fa" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        locale === "fa" && vazirmatn.variable,
        "font-sans",
      )}
      style={
        locale === "fa"
          ? ({ ["--font-sans"]: "var(--font-fa), sans-serif" } as CSSProperties)
          : undefined
      }
    >
      <body className="min-h-full bg-[#07080c] text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
