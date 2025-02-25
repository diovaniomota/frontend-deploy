import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { MainLayout } from "@/components/Layouts/MainLayout";
import { Providers } from "@/components/Layouts/Providers";
import { handleGetUser } from "@/lib/server/auth";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | GRF Talk",
        default: 'Home | GRF Talk',
    },
    icons: {
        icon: "/grftalk.png",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await handleGetUser()

    return (
        <html lang="pt-br" suppressHydrationWarning>
            <body className={nunito.className}>
                <Providers>
                    <MainLayout user={user}>
                        {children}
                    </MainLayout>
                </Providers>
            </body>
        </html>
    );
}
