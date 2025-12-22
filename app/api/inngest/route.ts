import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { dynamicWorkflow } from "@/inngest/functions";
import { helloWorld } from "@/inngest/hello";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [ dynamicWorkflow, helloWorld ],
});