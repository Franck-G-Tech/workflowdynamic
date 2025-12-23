import { mutation } from "./_generated/server";
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
