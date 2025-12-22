"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Bienvenido</h1>

      <div className="flex gap-4">
        {/* Botón Solicitud */}
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          onClick={() => router.push("/studio")}
        >
          Solicitud
        </button>

        {/* Botón Panel Admin */}
        <button
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
          onClick={() => router.push("/admin")}
        >
          Panel Admin
        </button>
      </div>
    </div>
  );
}
