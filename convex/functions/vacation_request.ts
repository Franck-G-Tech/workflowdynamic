import { inngest } from "../../inngest/client";
import { client as sanity } from "../../lib/sanity";
import { GetStepTools } from "inngest";

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
  stepIndex: number
): Promise<ApprovalResultType> {

  if (isApproved) {
    const message = "✅ Aprobado";
    await step.run(`${stepId}-result`, async () => message);
    console.log(`${message}! Continuando al siguiente paso...`);

    return {
      shouldContinue: true,
      result: { status: "approved", step: stepIndex },
      message
    };
  } else {
    const message = "⛔ Rechazado";
    await step.run(`${stepId}-result`, async () => message);
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

    // Obtener la solicitud de Sanity
    const vacationRequest = await step.run("fetch-vacation-request", async () => {
      return await sanity.fetch(
        `*[_type == "vacationRequest" && _id == $id][0]`,
        { id: requestId }
      );
    });

    if (!vacationRequest) {
      return {
        status: "error",
        message: "❌ No se encontró la solicitud de vacaciones"
      };
    }

    // Actualizar el estado a rechazado en Sanity
    await step.run("update-status-rejected", async () => {
      return await sanity
        .patch(requestId)
        .set({ status: "reject" })
        .commit();
    });

    console.log(`⛔ Solicitud de vacaciones ${requestId} marcada como rechazada`);

    return {
      status: "success",
      message: "✅ Solicitud de vacaciones actualizada a rechazada",
      requestId
    };
  }
);
