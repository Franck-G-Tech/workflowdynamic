import { action } from "../_generated/server";
import { v } from "convex/values";
import { inngest } from "../../inngest/client";

/**
 * Acción para disparar el evento de rechazo de vacaciones en Inngest
 * 
 * Para probar:
 * 1. Ve al dashboard de Convex (npx convex dashboard)
 * 2. Busca esta función: functions/test_vacation:triggerVacationRechazado
 * 3. Ejecuta con un requestId válido de Sanity
 */
export const triggerVacationRechazado = action({
    args: {
        requestId: v.string(),
    },
    handler: async (_ctx, { requestId }) => {
        console.log(`🚀 Disparando evento de rechazo para: ${requestId}`);

        // Enviar el evento a Inngest
        const result = await inngest.send({
            name: "convex/vacation_request.rechazado",
            data: {
                requestId,
            },
        });

        console.log("📨 Evento enviado a Inngest:", result);

        return {
            success: true,
            message: `Evento enviado para requestId: ${requestId}`,
            inngestResult: result,
        };
    },
});

/**
 * Acción de prueba simple para verificar que Inngest está conectado
 */
export const testInngestConnection = action({
    args: {},
    handler: async () => {
        console.log("🔌 Probando conexión con Inngest...");

        try {
            const result = await inngest.send({
                name: "test.event",
                data: {
                    message: "Prueba de conexión desde Convex",
                    timestamp: Date.now(),
                },
            });

            console.log("✅ Conexión exitosa:", result);

            return {
                success: true,
                message: "Conexión con Inngest establecida",
                result,
            };
        } catch (error) {
            console.error("❌ Error de conexión:", error);
            return {
                success: false,
                message: "Error al conectar con Inngest",
                error: String(error),
            };
        }
    },
});
