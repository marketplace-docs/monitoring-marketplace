
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Marketplace Dashboard',
  description: 'A real-time dashboard for e-commerce marketplace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light" style={{colorScheme: 'light'}}>
      <head>
        <link rel="icon" type="image/x-icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPkvoc0l6LssxSVIxrGv-i5LAqwyz1WpPSHpR3dXpEq6Udg5mu7m9SiP0heaHa-Tsg6m4&usqp=CAU" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
