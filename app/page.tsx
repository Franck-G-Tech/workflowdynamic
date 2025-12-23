"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-[#11131f]">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-medium text-gray-300">Gestión de Vacaciones</h2>
        <p className="text-gray-500">Selecciona el módulo para continuar</p>
      </div>

      <div className="flex gap-4">
        <button
          className="px-10 py-3 bg-[#1d4ed8] hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-xl active:scale-95"
          onClick={() => router.push("/requests/new")}
        >
          Solicitud
        </button>

        <button
          className="px-10 py-3 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-xl active:scale-95"
          onClick={() => router.push("/admin")}
        >
          Panel Admin
        </button>
      </div>
    </div>
  );
}