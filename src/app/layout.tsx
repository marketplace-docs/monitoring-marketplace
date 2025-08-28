
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
    <html lang="id" className="light">
      <head>
        <link rel="icon" type="image/x-icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPkvoc0l6LssxSVIxrGv-i5LAqwyz1WpPSHpR3dXpEq6Udg5mu7m9SiP0heaHa-Tsg6m4&usqp=CAU" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js" async></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0" async></script>
      </head>
      <body className="p-4 transition-colors duration-300">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

    