import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import GlobalAnimator from '@/components/Settings/GlobalAnimator';

export const metadata: Metadata = {
  title: "ProLance Lite - Freelance Task Manager",
  description: "A smart personal task and freelance work manager for freelancers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');var p=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var apply = t==='dark'||(t==='system'&&p)||(!t&&p); document.documentElement.classList.toggle('dark', !!apply);}catch(e){} })()` }} />
        <Navbar />
        <GlobalAnimator />
        <main className="flex-1 py-0">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
