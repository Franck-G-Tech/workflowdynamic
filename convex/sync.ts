import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { client } from "../lib/sanity";

// Query para obtener datos de Sanity y sincronizar con Convex
export const syncUsersFromSanity = query({
  args: {},
  handler: async (ctx) => {
    // Obtener usuarios de Sanity
    const sanityUsers = await client.fetch(
      `*[_type == "user"]{
        clerk_id,
        name,
        email,
        days_break,
        rol,
        start_workday,
        date_create,
        date_update,
        _id,
        _updatedAt
      }`
    );
    // Obtener usuarios de Convex
    const convexUsers = await ctx.db.query("Users").collect();
    // Comparar y determinar qué usuarios necesitan sincronización
    const updates = [];
    for (const sanityUser of sanityUsers) {
      const existingUser = convexUsers.find(u => u.clerk_id === sanityUser.clerk_id);
      
      if (!existingUser) {
        // Crear nuevo usuario en Convex
        updates.push({
          action: 'create',
          data: {
            clerk_id: sanityUser.clerk_id,
            name: sanityUser.name,
            email: sanityUser.email,
            days_break: sanityUser.days_break,
            rol: sanityUser.rol,
            start_workday: sanityUser.start_workday || null,
            date_create: new Date(sanityUser.date_create).getTime(),
            date_update: new Date(sanityUser.date_update || sanityUser._updatedAt).getTime(),
          }
        });
      } else if (
        new Date(sanityUser._updatedAt).getTime() > existingUser.date_update
      ) {
        // Actualizar usuario existente
        updates.push({
          action: 'update',
          id: existingUser._id,
          data: {
            name: sanityUser.name,
            email: sanityUser.email,
            days_break: sanityUser.days_break,
            rol: sanityUser.rol,
            start_workday: sanityUser.start_workday || null,
            date_update: new Date(sanityUser._updatedAt).getTime(),
          }
        });
      }
    }

    return updates;
  },
});
// Mutation para aplicar sincronización
export const applyUserSync = mutation({
  args: {
    updates: v.array(
      v.object({
        action: v.union(v.literal('create'), v.literal('update')),
        id: v.optional(v.id("Users")),
        data: v.object({
          clerk_id: v.string(),
          name: v.string(),
          email: v.string(),
          days_break: v.number(),
          rol: v.array(v.string()),
          start_workday: v.optional(v.number()),
          date_create: v.number(),
          date_update: v.number(),
        }),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const update of args.updates) {
      if (update.action === 'create') {
        const { clerk_id, name, email, days_break, rol, start_workday, date_create, date_update } = update.data;
        
        const id = await ctx.db.insert("Users", {
          clerk_id,
          name,
          email,
          days_break,
          rol: rol as ("pm" | "dev" | "admin")[], // Type assertion
          start_workday: start_workday || undefined,
          date_create,
          date_update,
        });
        
        results.push({ action: 'created', id });
      } else if (update.action === 'update' && update.id) {
        const { name, email, days_break, rol, start_workday, date_update } = update.data;
        
        await ctx.db.patch(update.id, {
          name,
          email,
          days_break,
          rol: rol as ("pm" | "dev" | "admin")[],
          start_workday: start_workday || undefined,
          date_update,
        });
        
        results.push({ action: 'updated', id: update.id });
      }
    }

    return results;
  },
});