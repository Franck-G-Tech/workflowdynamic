import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2025-12-23",
});

export const createSanityUser = internalAction({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    data: v.any(),
  },
  handler: async (_ctx, args) => {
    try {
        console.log(args.data);

      await sanity.createIfNotExists({
        _id: `${args.clerkId}`,
        _type: "user",
        name: args.name,
        clerk_id: args.clerkId,
        email: args.email,
        days_break: 12,
        rol: ["dev"],
        date_create: new Date(args.data.created_at).toISOString(),
        date_update: new Date(args.data.updated_at).toISOString(),
      });

      console.log("Usuario creado/verificado en Sanity exitosamente");
    } catch (error) {
      console.error("Error al crear usuario en Sanity:", error);
    }
  },
});