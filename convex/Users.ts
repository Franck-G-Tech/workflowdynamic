import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

export const upsertFromClerk = internalMutation({
  args: {
    event_type: v.string(),
    data: v.any(),
  },
  handler: async (ctx, { data, event_type }) => {
    const nombre = `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim();
    const email = data.email_addresses?.[0]?.email_address;

    if (!email) {
      return;
    }

    const existingUser = await ctx.db
      .query("Users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", data.id))
      .unique();

    if (event_type === "user.created") {
      if (existingUser) {
        return;
      }

      await ctx.db.insert("Users", {
        clerk_id: data.id,
        name: nombre,
        email: email,
        date_create: data.created_at,
        date_update: data.updated_at,
        
        days_break: 12,
        rol: ["dev"],
      });
    }

    if (event_type === "user.updated") {
      if (!existingUser) {
        return;
      }

      await ctx.db.patch(existingUser._id, {
        name: nombre,
        email: email,
        date_update: data.updated_at,
      });
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query('Users')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerkUserId)) 
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { calculateVacationDays } from "./breakcalculation";

export const updateAllUsersVacations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("Users").collect();

    const updates = users.map(async (user) => {
      if (!user.start_workday) return;

      const newDays = calculateVacationDays(user.start_workday);

      if (user.days_break !== newDays) {
        await ctx.db.patch(user._id, {
          days_break: newDays,
          date_update: Date.now(),
        });
      }
    });

    await Promise.all(updates);
    console.log(`Vacaciones actualizadas para ${users.length} usuarios.`);
  },
});