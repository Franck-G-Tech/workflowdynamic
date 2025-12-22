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
            message: "❌ El evento no tiene datos. Falta triggerId." 
        };
    }
    
    // 2. Obtener el workflow de Sanity
    const workflowDoc = await step.run("fetch-workflow-definition", async () => {
      return await sanity.fetch(
        `*[_type == "workflow" && triggerId == $trigger][0]`,
        { trigger: event.data.triggerId }
      );
    });

    if (!workflowDoc) {
      return { message: "No workflow definition found." };
    }

    // 3. Iterar los pasos (LA CORRECCIÓN ESTÁ AQUÍ)
    for (let i = 0; i < workflowDoc.steps.length; i++) {
      const currentStep = workflowDoc.steps[i];
      // Creamos un ID único para cada paso
      const stepId = `step-${i}-${currentStep._type}`;

      // --- CASO A: ES UNA ACCIÓN (Usamos step.run) ---
      if (currentStep._type === 'action') {
          await step.run(stepId, async () => {
            console.log(`⚡ Ejecutando acción: ${currentStep.actionType}`);
            console.log(`📩 Mensaje: ${currentStep.message}`);
            // Aquí llamarías a tu API de email real
            return { executed: true, type: currentStep.actionType };
          });
      } 
      
      // --- CASO B: ES UN DELAY SIMPLE (Usamos step.sleep o delay simulado) ---
      else if (currentStep._type === 'delay') {
          await step.run(stepId, async () => {
            console.log(`💤 Durmiendo por ${currentStep.durationMs}ms`);
            await new Promise(r => setTimeout(r, currentStep.durationMs));
            return { slept: true };
          });
      }

      // --- CASO C: APROBACIÓN HUMANA (Directo, SIN step.run envolvente) ---
      else if (currentStep._type === 'approval') {
          console.log(`✋ Esperando aprobación de`);
          
          // Nota: waitForEvent recibe el stepId como primer argumento
          const approvalEvent = await step.waitForEvent(stepId, {
            event: "workflow.approve",
            timeout: currentStep.timeout || "24h",
            match: "data.userId",
          });

          const isApproved = approvalEvent?.data?.approved;

          if (isApproved) {
            // Usamos step.run solo para dejar registro en el log de que pasó
            await step.run(`${stepId}-result`, async () => "✅ Aprobado");
            console.log("✅ Aprobado! Continuando al siguiente paso...");
          } else {
            await step.run(`${stepId}-result`, async () => "⛔ Rechazado");
            console.log("⛔ Rechazado o Expirado. Deteniendo workflow.");
            
            return { 
                status: "stopped", 
                reason: "Rejected by user or timed out",
                stoppedAtStep: i 
            };
          }
      }
    }

    return { success: true, workflow: workflowDoc.title };
  }
);