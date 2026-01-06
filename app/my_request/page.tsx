"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function MyVacationRequestsPage() {
  const { user, isLoaded: userLoaded } = useUser();

  const myRequests = useQuery(
    api.vacation_request.cosultMyRequest, 
    user ? { clerkId: user.id } : "skip"
  );

  if (!userLoaded || myRequests === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-400 animate-pulse">Cargando mis solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Mis Solicitudes</h1>
        <p className="text-gray-400 mt-2">Seguimiento de tus periodos vacacionales</p>
      </div>
      
      <div className="grid gap-6">
        {myRequests.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-gray-700 rounded-2xl p-12 text-center">
            <p className="text-gray-500">No has realizado ninguna solicitud todavía.</p>
          </div>
        ) : (
          myRequests.map((req) => (
            <div key={req._id} className="relative rounded-2xl p-6 bg-white shadow-xl flex flex-col gap-5 border border-gray-100">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      req.status === "progress"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : req.status === "aprove"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {req.status === "progress" ? "Pendiente" : req.status === "aprove" ? "Aprobada" : "Rechazada"}
                  </span>
                  
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">
                    {req.description}
                  </h3>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Desde</p>
                    <p className="text-sm font-semibold text-gray-800">{new Date(req.start_day).toLocaleDateString()}</p>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Hasta</p>
                    <p className="text-sm font-semibold text-gray-800">{new Date(req.end_day).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {req.answers && req.answers.length > 0 && (
                <div className="mt-2 space-y-3">
                  <hr className="border-gray-100" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comentarios de Revisión</p>
                  <div className="grid gap-2">
                    {req.answers.map((ans, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-lg text-sm border border-gray-100">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${ans.answer ? "bg-green-500" : "bg-red-500"}`} />
                        <p className="text-gray-600">
                          <span className="font-semibold text-gray-700">{ans.answer ? "Aprobado:" : "Rechazado:"}</span> {ans.coment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}