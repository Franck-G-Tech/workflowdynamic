import { internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { inngest } from "./inngest";

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
    const response = await ctx.db.insert("Vacation_request", {
      user_id: user._id, 
      clerk_id: args.clerk_id,
      description: args.description,
      start_day: args.start_day,
      end_day: args.end_day, // These are expected to be numbers (timestamps) based on schema
      status: "progress",
      answers: [],
    });

    await ctx.scheduler.runAfter(0, internal.requests.sendToInngest, {
      solicitudId: response,
      clerkId: args.clerk_id
    });
  },
});

////////////////////////////////////////////////////Envio de JSON a Inggest////////////////////////////////////
export const sendToInngest = internalAction({
  args: {
    solicitudId: v.id("Vacation_request"),
    clerkId: v.string(),
  },
  handler: async (_ctx, args) => {
    
    try {
      await inngest.send({
        name: "workflow.trigger",
        data: {
          triggerId: "user.vacation",
          solicitudId: args.solicitudId,
          clerkId: args.clerkId,
        },
      });
 
      console.log(`Evento enviado correctamente a Inngest: ${args.solicitudId}`);
    } catch (error) {
      console.error("Error enviando evento con SDK:", error);
      throw error;
    }
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

export const evaluarStatusSolicitud = mutation({
    args: {
        requestId: v.id("Vacation_request"),
    },
    handler: async (ctx, args) => {
        const request = await ctx.db.get(args.requestId);
        if (!request) throw new Error("Solicitud no encontrada");

        const answers = request.answers || [];

        // 1. REGLA DE RECHAZO: .some() devuelve true si al menos uno cumple la condición
        const algunRechazo = answers.some((a) => a.answer === false);

        if (algunRechazo) {
            await ctx.db.patch(args.requestId, { status: "reject" });
            return { status: "reject" };
        }

        // 2. REGLA DE APROBACIÓN: .every() devuelve true solo si TODOS cumplen
        const aprobacionTotal = answers.every((a) => a.answer === true);

        if (aprobacionTotal) {
            await ctx.db.patch(args.requestId, { status: "aprove" });
            return { status: "aprove" };
        }
    },
});