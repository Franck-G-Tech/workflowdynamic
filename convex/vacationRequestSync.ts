import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { client } from "../lib/sanity";

export const syncVacationRequests = query({
  args: {},
  handler: async (ctx) => {
    // Primero necesitamos mapear IDs de Sanity a IDs de Convex
    const convexUsers = await ctx.db.query("Users").collect();
    const userMap = new Map(
      convexUsers.map(user => [user.clerk_id, user._id])
    );
    // Obtener solicitudes de Sanity
    const sanityRequests = await client.fetch(
      `*[_type == "vacationRequest"]{
        _id,
        user_id->{clerk_id},
        description,
        start_day,
        end_day,
        answers[]{
          id_user->{clerk_id},
          answer,
          coment
        },
        status,
        _updatedAt
      }`
    );
    // Obtener solicitudes existentes en Convex
    const convexRequests = await ctx.db.query("Vacation_request").collect();

    const updates = [];

    for (const sanityRequest of sanityRequests) {
      // Encontrar el user_id correspondiente en Convex
      const convexUserId = userMap.get(sanityRequest.user_id?.clerk_id);
      
      if (!convexUserId) {
        console.warn(`User not found in Convex: ${sanityRequest.user_id?.clerk_id}`);
        continue;
      }
      // Convertir answers
      const answers = await Promise.all(
        (sanityRequest.answers || []).map(async (answer: any) => {
          const answerUserId = userMap.get(answer.id_user?.clerk_id);
          return {
            id_user: answerUserId,
            answer: answer.answer,
            coment: answer.coment || undefined,
          };
        }).filter((answer: any) => answer.id_user)
      );

      const existingRequest = convexRequests.find(
        req => req.user_id === convexUserId && 
               new Date(sanityRequest.start_day).getTime() === req.start_day
      );

      const requestData = {
        user_id: convexUserId,
        description: sanityRequest.description || undefined,
        start_day: new Date(sanityRequest.start_day).getTime(),
        end_day: new Date(sanityRequest.end_day).getTime(),
        answers,
        status: sanityRequest.status as "progress" | "aprove" | "reject",
      };

      if (!existingRequest) {
        updates.push({
          action: 'create',
          data: requestData,
        });
      } else if (
        new Date(sanityRequest._updatedAt).getTime() > existingRequest._creationTime
      ) {
        updates.push({
          action: 'update',
          id: existingRequest._id,
          data: requestData,
        });
      }
    }

    return updates;
  },
});

export const applyVacationRequestSync = mutation({
  args: {
    updates: v.array(
      v.object({
        action: v.union(v.literal('create'), v.literal('update')),
        id: v.optional(v.id("Vacation_request")),
        data: v.object({
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
          ),
        }),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const update of args.updates) {
      if (update.action === 'create') {
        const id = await ctx.db.insert("Vacation_request", update.data);
        results.push({ action: 'created', id });
      } else if (update.action === 'update' && update.id) {
        await ctx.db.patch(update.id, update.data);
        results.push({ action: 'updated', id: update.id });
      }
    }

    return results;
  },
});