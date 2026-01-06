import { inngest } from "../inngest/client";
import { GetStepTools } from "inngest";
import { fetchMutation } from "convex/nextjs";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalAction, mutation, query } from "./_generated/server";
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
export const solicitarRespuesta = mutation({
    args: {
        requestId: v.id("Vacation_request"),
        clerk_id: v.string(),
    },
    handler: async (ctx, args) => {
        const request = await ctx.db.get(args.requestId);
        if (!request) throw new Error("Solicitud no encontrada");

        const currentAnswers = request.answers || [];

        const alreadyExists = currentAnswers.some((a) => a.clerk_id === args.clerk_id);
        if (alreadyExists) {
            console.log("El usuario ya está asignado para aprobar");
            return;
        }

        const newAnswers = [
            ...currentAnswers, 
            { clerk_id: args.clerk_id }
        ];

        await ctx.db.patch(args.requestId, { answers: newAnswers });
    },
});

export const registrarRespuesta = mutation({
    args: {
        requestId: v.id("Vacation_request"),
        clerk_id: v.string(),
        answer: v.boolean(),
        coment: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const request = await ctx.db.get(args.requestId);
        if (!request) throw new Error("Solicitud no encontrada");

        const currentAnswers = request.answers || [];

        // 1. Buscamos el índice donde está este clerk_id
        const index = currentAnswers.findIndex((a) => a.clerk_id === args.clerk_id);

        if (index === -1) {
            throw new Error("Este usuario no estaba autorizado para aprobar esta solicitud.");
        }

        // 2. Modificamos ESE objeto específico dentro del array
        // Usamos spread operator (...) para mantener el clerk_id y sobreescribir lo demás
        currentAnswers[index] = {
            ...currentAnswers[index],
            answer: args.answer,
            coment: args.coment
        };

        // 3. Guardamos el array actualizado
        await ctx.db.patch(args.requestId, { answers: currentAnswers });

        // 4. Mandamos a los datos a Inggest
        await ctx.scheduler.runAfter(0, internal.vacation_request.enviarEventoInngest, {
            solicitudId: args.requestId,
            clerk_id: args.clerk_id,
            answer: args.answer
        });

        return { success: true };
    },
});

//Mandar solicitud a Inngest
export const enviarEventoInngest = internalAction({
  args: {
    solicitudId: v.id("Vacation_request"),
    clerk_id: v.string(),
    answer: v.boolean(),
  },
  handler: async (_ctx, args) => {
    await inngest.send({
      name: "workflow.approve",
      data: {
        solicitudId: args.solicitudId,
        identificador: args.clerk_id,
        approved: args.answer,
      },
    });
    console.log(`Evento enviado a Inngest para solicitud: ${args.solicitudId}`);
  },
});

export const consultarSolicitudes = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const allRequests = await ctx.db.query("Vacation_request").collect();

    const userRequests = allRequests.filter((req) => {
      
      const isCreator = req.clerk_id === args.clerkId;

      const isApprover = req.answers?.some((answer) => answer.clerk_id === args.clerkId);

      return isCreator || isApprover;
    });

    return userRequests;
  },
});

///////////////////////////////////////////////////////////
export const cosultMyRequest = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("Vacation_request")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerkId))
      .collect();

    return requests;
  },
});