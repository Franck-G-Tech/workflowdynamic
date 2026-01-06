"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

export default function VacationRequestsPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [comentarios, setComentarios] = useState<{ [key: string]: string }>({});
  
  const [confirmando, setConfirmando] = useState<{ 
    id: string; 
    tipo: "aprove" | "reject" | null 
  }>({ id: "", tipo: null });

  const requests = useQuery(
    api.vacation_request.consultarSolicitudes, 
    user ? { clerkId: user.id } : "skip"
  );
  
  const registrarRespuesta = useMutation(api.vacation_request.registrarRespuesta);

  const ejecutarAccion = async (requestId: Id<"Vacation_request">, isApproved: boolean) => {
    if (!user) return;
    try {
      await registrarRespuesta({ 
        requestId, 
        clerk_id: user.id, 
        answer: isApproved,
        coment: comentarios[requestId] || (isApproved ? "Aprobado" : "Rechazado")
      });
      setConfirmando({ id: "", tipo: null });
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
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Gestión de Vacaciones</h1>
        <p className="text-gray-400 text-sm">Ahora puedes responder a cualquier solicitud, incluso las tuyas</p>
      </div>
      
      <div className="grid gap-6">
        {requests.map((req) => {
          const miRespuesta = req.answers?.find(a => a.clerk_id === user?.id);
          const yaRespondio = miRespuesta?.answer !== undefined;
          const estaConfirmandoEsta = confirmando.id === req._id;

          return (
            <div key={req._id} className="relative rounded-xl p-6 bg-white shadow-xl flex flex-col gap-4">
              
              {estaConfirmandoEsta && (
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-white/60 backdrop-blur-[2px] rounded-xl">
                  <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-5 max-w-[280px] text-center">
                    <p className="text-sm font-bold text-gray-900 mb-4">
                      ¿Seguro que deseas {confirmando.tipo === "aprove" ? "aprobar" : "rechazar"}?
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => setConfirmando({ id: "", tipo: null })}
                        className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => ejecutarAccion(req._id, confirmando.tipo === "aprove")}
                        className={`px-4 py-2 text-xs font-bold text-white rounded-lg ${
                          confirmando.tipo === "aprove" ? "bg-blue-600" : "bg-red-600"
                        }`}
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-gray-100 text-gray-700">
                    {req.status}
                  </span>
                  {yaRespondio && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                        miRespuesta.answer ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      {miRespuesta.answer ? "✓ Auto-Aprobado" : "✕ Auto-Rechazado"}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 italic">"{req.description}"</h3>
                
                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                   <div>
                     <span className="block font-bold text-gray-400 text-[9px]">INICIO</span>
                     <span className="text-gray-900">{new Date(req.start_day).toLocaleDateString()}</span>
                   </div>
                   <div className="border-l pl-4">
                     <span className="block font-bold text-gray-400 text-[9px]">FIN</span>
                     <span className="text-gray-900">{new Date(req.end_day).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>

              {!yaRespondio && (
                <div className="mt-2 space-y-3">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Agrega un comentario (opcional)
                  </label>
                  <textarea
                    value={comentarios[req._id] || ""}
                    onChange={(e) => setComentarios(prev => ({ ...prev, [req._id]: e.target.value }))}
                    placeholder="Escribe un comentario para tu propia solicitud..."
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setConfirmando({ id: req._id, tipo: "reject" })}
                      className="px-5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => setConfirmando({ id: req._id, tipo: "aprove" })}
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
                    >
                      Aprobar
                    </button>
                  </div>
                </div>
              )}

              {yaRespondio && miRespuesta.coment && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500">
                  <span className="font-bold text-gray-700 mr-1 italic">Comentario registrado:</span> {miRespuesta.coment}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}