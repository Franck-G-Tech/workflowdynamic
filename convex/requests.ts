import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRequest = mutation({
  args: {
    clerk_id: v.string(),
    description: v.optional(v.string()),
    start_day: v.number(),
    end_day: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Find the user by clerk_id
    const user = await ctx.db
      .query("Users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerk_id))
      .first();

    if (!user) {
      throw new Error("Usuario no encontrado en Convex");
    }

    // 2. Create the request linked to that user
    await ctx.db.insert("Vacation_request", {
      user_id: user._id, 
      clerk_id: args.clerk_id,
      description: args.description,
      start_day: args.start_day,
      end_day: args.end_day, // These are expected to be numbers (timestamps) based on schema
      status: "progress",
      answers: [],
    });
  },
});


////////////////////
export const updateStatus = mutation({
  args: {
    requestId: v.id("Vacation_request"),
    status: v.union(
      v.literal("progress"),
      v.literal("aprove"),
      v.literal("reject")
    ),
  },
  handler: async (ctx, args) => {
    // 1. Verificar si la solicitud existe
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("La solicitud de vacaciones no existe");
    }
 
    // 2. Actualizar solo el campo status
    await ctx.db.patch(args.requestId, {
      status: args.status,
    });
 
    return {
      success: true,
      requestId: args.requestId,
      newStatus: args.status,
    };
  },
});


export const getAllRequests = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db
      .query("Vacation_request")
      .order("desc")
      .collect();
 
    return requests;
  },
});