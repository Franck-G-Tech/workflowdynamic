import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },       // ID único de la función
  { event: "test.event" },     // El evento que la despierta
  async ({ event, step }) => {
    
    await step.run("log-data", async () => {
      console.log("👋 Hola! El evento llegó correctamente.");
      return { message: "Conexión exitosa" };
    });

    return { success: true };
  }
);