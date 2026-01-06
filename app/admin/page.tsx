"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

export default function VacationRequestsPage() {
  const { user, isLoaded: userLoaded } = useUser();

  const requests = useQuery(
    api.vacation_request.consultarSolicitudes, 
    user ? { clerkId: user.id } : "skip"
  );
  
  const registrarRespuesta = useMutation(api.vacation_request.registrarRespuesta);

  const handleAction = async (requestId: Id<"Vacation_request">, isApproved: boolean) => {
    if (!user) return;

    try {
      await registrarRespuesta({ 
        requestId, 
        clerk_id: user.id, 
        answer: isApproved,
        coment: isApproved ? "Aprobado desde el panel" : "Rechazado desde el panel" 
      });
      alert(`Respuesta registrada con éxito`);
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Error al procesar");
    }
  };

  if (!userLoaded || requests === undefined) {
    return <p className="p-8 text-gray-400">Cargando solicitudes...</p>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Gestión de Aprobaciones</h1>
        <p className="text-gray-400 text-sm">Registra tu decisión sobre las solicitudes pendientes</p>
      </div>
      
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <p className="text-gray-500 bg-gray-900/50 p-6 rounded-xl border border-gray-800 border-dashed text-center">
            No hay solicitudes para mostrar.
          </p>
        ) : (
          requests.map((req) => {
            const miRespuesta = req.answers?.find(a => a.clerk_id === user?.id);
            const yaRespondio = miRespuesta?.answer !== undefined;

            return (
              <div 
                key={req._id} 
                className="rounded-xl p-6 bg-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      req.status === "progress" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                      req.status === "aprove" ? "bg-green-100 text-green-700 border border-green-200" : 
                      "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      {req.status}
                    </span>

                    {yaRespondio && (
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                         miRespuesta.answer 
                           ? "bg-green-50 text-green-600 border-green-200" 
                           : "bg-red-50 text-red-600 border-red-200"
                       }`}>
                         {miRespuesta.answer ? "✓ Aprobado por ti" : "✕ Rechazado por ti"}
                       </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {req.description || "Sin descripción"}
                  </h3>

                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      <strong>Desde:</strong> {new Date(req.start_day).toLocaleDateString()}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      <strong>Hasta:</strong> {new Date(req.end_day).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {!yaRespondio && req.clerk_id !== user?.id && (
                  <div className="flex gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                    <button
                      onClick={() => handleAction(req._id, false)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleAction(req._id, true)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-colors"
                    >
                      Aprobar
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
