import type { Metadata } from 'next';
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import SidebarItems from '@/components/SidebarItems';
import './globals.css';

export const metadata: Metadata = {
  title: 'RRHH Flow - Vacaciones',
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
        <body className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
              <div className="p-6 flex flex-col gap-2">
                <h1 className="text-xl font-bold text-blue-600 tracking-tight">
                  Vacaciones
                </h1>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                  Gestión Interna
                </p>
              </div>

              <nav className="flex-1 px-4 space-y-1">
                 <SidebarItems />
              </nav>

              <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <UserButton afterSignOutUrl="/" />
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-gray-700">Mi Cuenta</p>
                  <p className="text-[10px] text-gray-400">Perfil de empleado</p>
                </div>
              </div>
            </aside>

            <main className="flex-1 overflow-y-auto relative bg-white">
              <div className="max-w-4xl mx-auto p-8">
                {children}
              </div>
            </main>
        </body>
      </html>
    </ClerkProvider>
  );
}