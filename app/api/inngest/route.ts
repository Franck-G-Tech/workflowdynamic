import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { dynamicWorkflow } from "@/inngest/functions";
import { getVacationRechazado } from "@/convex/functions/vacation_request";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [dynamicWorkflow, getVacationRechazado],
});