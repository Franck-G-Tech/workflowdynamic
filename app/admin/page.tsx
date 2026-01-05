"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function VacationRequestsPage() {
  const requests = useQuery(api.requests.getAllRequests); 
  const updateStatus = useMutation(api.requests.updateStatus);

  const handleAction = async (requestId: Id<"Vacation_request">, status: "aprove" | "reject") => {
    try {
      await updateStatus({ requestId, status });
      alert(`Solicitud ${status === "aprove" ? "aprobada" : "rechazada"} con éxito`);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al procesar la solicitud");
    }
  };

  if (requests === undefined) return <p className="p-8 text-gray-400">Cargando solicitudes...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Panel de Aprobación de Vacaciones</h1>
      
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <p className="text-gray-500">No hay solicitudes pendientes.</p>
        ) : (
          requests.map((req) => (
            /* TARJETA BLANCA */
            <div 
              key={req._id} 
              className="rounded-xl p-6 bg-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-transform hover:scale-[1.01]"
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
                  <p className="text-xs font-mono text-gray-400">ID: {req._id}</p>
                </div>

                {/* Texto oscuro sobre fondo blanco */}
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {req.description || "Sin descripción"}
                </h3>

                {/* Fechas con buen contraste */}
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    <strong className="text-gray-800">Desde:</strong> {new Date(req.start_day).toLocaleDateString()}
                  </span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    <strong className="text-gray-800">Hasta:</strong> {new Date(req.end_day).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {req.status === "progress" && (
                <div className="flex gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "aprove")}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-colors"
                  >
                    Aprobar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}