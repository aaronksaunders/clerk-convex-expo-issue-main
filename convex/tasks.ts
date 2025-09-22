import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

// Query: Get all tasks for the current user
export const get = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("tasks")
      .withIndex("by_owner", (q) => q.eq("owner", identity.subject))
      .collect();
  },
});

// Mutation: Add a new task for the current user
export const add = mutationGeneric({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("tasks", {
      text: args.text,
      owner: identity.subject,
      createdAt: Date.now(),
    });
  },
});
