import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to update the status of a vacation request
export const updateStatus = mutation({
    args: {
        requestId: v.id("Vacation_request"),
        status: v.union(v.literal("progress"), v.literal("aprove"), v.literal("reject")),
        answers: v.optional(v.array(
            v.object({
                id_user: v.id("Users"),
                answer: v.boolean(),
                coment: v.optional(v.string())
            })
        ))
    },
    handler: async (ctx, args) => {
        const { requestId, status, answers } = args;

        // Construct the update object
        const updateData: any = { status };
        if (answers) {
            updateData.answers = answers;
        }

        await ctx.db.patch(requestId, updateData);
    },
});

export const create = mutation({
    args: {
        user_id: v.id("Users"),
        description: v.optional(v.string()),
        start_day: v.number(),
        end_day: v.number(),
    },
    handler: async (ctx, args) => {
        const { user_id, description, start_day, end_day } = args;
        const requestId = await ctx.db.insert("Vacation_request", {
            user_id,
            description,
            start_day,
            end_day,
            status: "progress",
            answers: [],
        });
        return requestId;
    },
});
