"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileUser, UserStar } from "lucide-react";

export default function SidebarItems() {
  const pathname = usePathname();

  const links = [
    { name: "Solicitud", href: "/studio", icon: FileUser, match: "/studio",  },
    { name: "Panel Admin", href: "/admin", icon: UserStar, match: "/admin", },
  ];

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;

        // ✅ Activo para rutas dinámicas
        const isActive = pathname.startsWith(link.match);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all
              ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 font-semibold"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm">{link.name}</span>
            </div>
          </Link>
        );
      })}
    </>
  );
}
