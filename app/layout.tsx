import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import './globals.css';
import { ConvexClientProvider } from "./ConvexClientProider";

export const metadata: Metadata = {
  title: 'WorkFlow - Vacaciones',
  description: 'Gestión de vacaciones con Inngest y Convex',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="bg-[#11131f] text-white min-h-screen relative overflow-x-hidden">
          <Navbar />
          <main className="min-h-screen w-full">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}