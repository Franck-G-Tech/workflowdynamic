import { serve } from "inngest/next";
import { Inngest } from "inngest";

export const { GET, POST, PUT } = serve({
  client: new Inngest({ id: "my-app" }),
  functions: [
    /* your functions will be passed here later! */
  ],
});