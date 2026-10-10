import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Lex System',
    description: 'Enterprise-Grade Legal Operations Platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen flex flex-col">
                {children}
            </body>
        </html>
    );
}
