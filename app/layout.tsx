import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Victory Energy | AI Automation",
    description: "AI-Powered Marketing & Operations managed by ScalePods",
    icons: {
        icon: '/VE-Logo-Color.svg',
        shortcut: '/VE-Logo-Color.svg',
        apple: '/VE-Logo-Color.svg',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="antialiased dark">
            <body>{children}</body>
        </html>
    );
}
