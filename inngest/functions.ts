import { inngest } from "./client";
import { client as sanity } from "@/lib/sanity";

export const dynamicWorkflow = inngest.createFunction(
  { id: "dynamic-workflow-runner" },
  { event: "workflow.trigger" },
  async ({ event, step }) => {

    // 1. Validación de seguridad
    if (!event.data || !event.data.triggerId) {
        return { 
            status: "error", 
            message: "El evento no tiene datos. Falta triggerId." 
        };
    }

    //Se consiguen todos los datos para su posterior uso
    const workflowDoc = await step.run("fetch-workflow-definition", async () => {
      return await sanity.fetch(
        `*[_type == "workflow" && triggerId == $trigger][0]{
          ...,
          steps[]{
            ...,
            // Proyección: Si es aprobación, traemos el clerk_id del usuario referenciado
            _type == 'approval' => {
              ...,
              "approverClerkId": approver->clerk_id
            }
          }
        }`,
        { trigger: event.data.triggerId }
      );
    });

    if (!workflowDoc) {
      return { message: "No workflow definition found." };
    }

    // 3. Iterar los pasos
    for (let i = 0; i < workflowDoc.steps.length; i++) {
      const currentStep = workflowDoc.steps[i];
      const stepId = `step-${i}-${currentStep._type}`;

      // --- CASO A: ES UNA ACCIÓN ---
      if (currentStep._type === 'action') {
          await step.run(stepId, async () => {
            console.log(`⚡ Ejecutando acción: ${currentStep.actionType}`);
            console.log(`Mensaje: ${currentStep.message}`);
            
            return { executed: true, type: currentStep.actionType };
          });
      } 
      
      // --- CASO B: ES UN DELAY ---
      else if (currentStep._type === 'delay') {
          console.log(`💤 Durmiendo por ${currentStep.durationMs}ms`);
          await step.sleep(stepId, currentStep.durationMs);
      }

      // --- CASO C: APROBACIÓN HUMANA (Con Bucle de Seguridad) ---
      else if (currentStep._type === 'approval') {
          const usuarioAutorizado = currentStep.approverClerkId; 
          console.log(`Este paso solo puede ser aprobado por: ${usuarioAutorizado}`);

          let decisionFinalTomada = false;
          let intento = 0;

          //console.log(currentStep);
          //console.log(workflowDoc);
          //console.log("El Clerk ID del aprobador es:", currentStep.approverClerkId);

          //manda a convex la solicitud


          while (!decisionFinalTomada) {
            intento++;
            const waitStepId = `${stepId}-wait-attempt-${intento}`;

            const approvalEvent = await step.waitForEvent(waitStepId, {
              event: "workflow.approve",
              timeout: currentStep.timeout || "24h",
              match: "data.solicitudId", 
            });

            if (!approvalEvent) {
               await step.run(`${stepId}-timeout`, async () => "Tiempo agotado");
               return { 
                   status: "stopped", 
                   reason: "Timeout waiting for approval", 
                   stoppedAtStep: i 
               };
            }

            const quienRespondio = approvalEvent.data.identificador;

            console.log(`${quienRespondio} es ${usuarioAutorizado}`);

            if (quienRespondio !== usuarioAutorizado) {
               await step.run(`${stepId}-security-alert-${intento}`, async () => {
                 console.warn(`ALERTA: Usuario ${quienRespondio} intentó aprobar sin permiso.`);
                 return `Intento fallido #${intento}`;
               });
               
               continue; 
            }

            const isApproved = approvalEvent.data.approved;
            decisionFinalTomada = true;

            if (isApproved) {
              await step.run(`${stepId}-result`, async () => "Aprobado");
            } else {
              await step.run(`${stepId}-result`, async () => "Rechazado");
              
              return { 
                  status: "stopped", 
                  reason: "Rejected by user",
                  stoppedAtStep: i 
              };
            }
          }
      }
    }

    return { success: true, workflow: workflowDoc.title };
  }
);