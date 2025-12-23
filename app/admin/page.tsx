"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function VacationRequestsPage() {
  // 1. Obtenemos todas las solicitudes (asegúrate de tener este query en convex)
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

  if (requests === undefined) return <p className="p-8">Cargando solicitudes...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de Aprobación de Vacaciones</h1>
      
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <p className="text-gray-500">No hay solicitudes pendientes.</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="border rounded-lg p-6 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    req.status === "progress" ? "bg-yellow-100 text-yellow-700" :
                    req.status === "aprove" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {req.status}
                  </span>
                  <p className="text-sm text-gray-500">ID: {req._id}</p>
                </div>
                <h3 className="font-semibold text-lg">{req.description || "Sin descripción"}</h3>
                <p className="text-sm">
                  <strong>Desde:</strong> {new Date(req.start_day).toLocaleDateString()} 
                  <span className="mx-2">|</span>
                  <strong>Hasta:</strong> {new Date(req.end_day).toLocaleDateString()}
                </p>
              </div>

              {req.status === "progress" && (
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "aprove")}
                    className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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