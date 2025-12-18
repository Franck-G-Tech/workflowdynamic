import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
 
export default defineSchema({
  userStats: defineTable({
    userId: v.string(), // Clerk ID
    vacationDaysLeft: v.number(),
    totalDaysAllocated: v.number(), // Total de días al año
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
 
  // Tabla principal de solicitudes
  vacationRequests: defineTable({
    requesterId: v.string(), // Clerk ID del empleado
    requesterName: v.string(),
    startDate: v.string(), // O v.number() si usas timestamps
    endDate: v.string(),
    totalDays: v.number(),
    // El ID del PM que debe aprobar (obtenido de Sanity al crear la solicitud)
    approverPmId: v.string(), 
    // Estado del flujo
    // pending_pm -> pending_admin -> approved | rejected
    status: v.union(
      v.literal("pending_pm"),
      v.literal("pending_admin"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    // Auditoría de quién rechazó o aprobó
    rejectionReason: v.optional(v.string()),
    processedByAdmin: v.boolean(),
    createdAt: v.number(),
  })
  .index("by_requester", ["requesterId"])
  .index("by_status", ["status"])
  .index("by_pm", ["approverPmId"]),
 
  // Opcional: Tabla de logs para Inngest y auditoría
  auditLogs: defineTable({
    requestId: v.id("vacationRequests"),
    action: v.string(), // ej: "PM_APPROVED", "ADMIN_REJECTED"
    timestamp: v.number(),
    note: v.string(),
  }),
});