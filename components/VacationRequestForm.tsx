'use client'

import { useActionState } from "react";
import { createVacationRequest } from "@/app/actions/createVacationRequest";

// Definimos el estado inicial
const initialState = {
    message: "",
    success: false
}

export default function VacationRequestForm({ sanityUserId, clerkUserId }: { sanityUserId: string, clerkUserId: string }) {
    const [state, formAction, isPending] = useActionState(createVacationRequest, initialState);

    return (
        <form action={formAction} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Nueva Solicitud de Vacaciones</h2>

            {/* Campo oculto para pasar el ID de Sanity y Clerk */}
            <input type="hidden" name="sanityUserId" value={sanityUserId} />
            <input type="hidden" name="clerkUserId" value={clerkUserId} />

            <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                <input
                    type="date"
                    name="startDay"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                <input
                    type="date"
                    name="endDay"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción (Motivo)</label>
                <textarea
                    name="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-black"
                />
            </div>

            {state?.message && (
                <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isPending ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
        </form>
    );
}
