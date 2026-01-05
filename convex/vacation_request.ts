import { inngest } from "../inngest/client";
import { GetStepTools } from "inngest";
import { fetchMutation } from "convex/nextjs";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

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