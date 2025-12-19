import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
 
export default defineSchema({
  Users: defineTable({
    clerk_id: v.string(),
    name: v.string(),
    email: v.string(),
    days_break: v.number(),
    rol: v.array(
        v.union(
            v.literal("pm"),
            v.literal("dev"),
            v.literal("admin"),
        )
  ),
  start_workday: v.optional(v.number()),
  date_create: v.number(),
  date_update: v.number(),
  })
  .index("by_clerk_id", ["clerk_id"])
  .index("by_name", ["name"]),

  Vacation_request: defineTable({
    user_id: v.id("Users"),
    description: v.optional(v.string()),
    start_day: v.number(),
    end_day: v.number(),
    answers: v.array(
        v.object({
            id_user: v.id("Users"),
            answer: v.boolean(),
            coment: v.optional(v.string()),
        })
    ),
    status: v.union(
        v.literal("progress"),
        v.literal("aprove"),
        v.literal("reject"),
    )
  })
});