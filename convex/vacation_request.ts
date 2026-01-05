import { inngest } from "../inngest/client";
import { GetStepTools } from "inngest";
import { fetchMutation } from "convex/nextjs";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Tipo para el resultado de la aprobación
type ApprovalResultType = {
  shouldContinue: boolean;
  result: { status: string; step?: number; reason?: string; stoppedAtStep?: number };
  message?: string;
};

// Tipo para las herramientas de paso de Inngest
type InngestStep = GetStepTools<typeof inngest>;

export async function handleApprovalResult(
  step: InngestStep,
  stepId: string,
  isApproved: boolean,
  stepIndex: number,
  requestId: string,
): Promise<ApprovalResultType> {

  const convexRequestId = requestId as Id<"Vacation_request">;

  if (isApproved) {
    const message = "✅ Aprobado";
    await step.run(`${stepId}-result`, async () => {
      await fetchMutation(api.requests.updateStatus, {
        requestId: convexRequestId,
        status: "aprove",
      });
      return message;
    });
    console.log(`${message}! Continuando al siguiente paso...`);

    return {
      shouldContinue: true,
      result: { status: "approved", step: stepIndex },
      message
    };
  } else {
    const message = "⛔ Rechazado";
    await step.run(`${stepId}-result`, async () => {
      await fetchMutation(api.requests.updateStatus, {
        requestId: convexRequestId,
        status: "reject",
      });
      return message;
    });
    console.log(`${message} o Expirado. Deteniendo workflow.`);

    return {
      shouldContinue: false,
      result: {
        status: "stopped",
        reason: "Rejected by user or timed out",
        stoppedAtStep: stepIndex
      },
      message
    };
  }
}

export const getVacationRechazado = inngest.createFunction(
  {
    id: "get-vacation-rechazado",
    name: "Get Vacation Rechazado",
  },
  { event: "convex/vacation_request.rechazado" },
  async ({ event, step }) => {
    const requestId = event.data?.requestId as string;

    if (!requestId) {
      return {
        status: "error",
        message: "❌ No se proporcionó requestId"
      };
    }

    // Actualizar el estado a rechazado en Convex
    await step.run("update-status-rejected", async () => {
      await fetchMutation(api.requests.updateStatus, {
        requestId: requestId as Id<"Vacation_request">,
        status: "reject"
      });
    });

    console.log(`⛔ Solicitud de vacaciones ${requestId} marcada como rechazada`);

    return {
      status: "success",
      message: "✅ Solicitud de vacaciones actualizada a rechazada",
      requestId
    };
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////
export const addAnswer = mutation({
    args: {
        requestId: v.id("Vacation_request"),
        id_user: v.id("Users"),
        answer: v.boolean(),
        coment: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { requestId, id_user, answer, coment } = args;
 
        // Obtener el documento actual
        const request = await ctx.db.get(requestId);
        if (!request) {
            throw new Error("Vacacion no encontrada");
        }
 
        // Obtener las respuestas actuales o crear array vacío
        const currentAnswers = request.answers || [];
 
        // Crear la nueva respuesta con timestamp
        const newAnswer = {
            id_user,
            answer,
            coment,
            answered_at: Date.now() // Registra cuándo se hizo la modificación
        };
 
        // Agregar la nueva respuesta al array
        const updatedAnswers = [...currentAnswers, newAnswer];
 
        // Actualizar el documento
        await ctx.db.patch(requestId, { answers: updatedAnswers });
 
        return { success: true, answeredBy: id_user };
    },
});