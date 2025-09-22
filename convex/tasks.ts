import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

/**
 * Query to get all tasks for the current authenticated user
 * Returns an empty array if user is not authenticated
 * @returns Promise<Array> - Array of task objects owned by the current user
 */
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

/**
 * Mutation to add a new task for the current authenticated user
 * Requires authentication and validates the user identity
 * @param args - Object containing the task text
 * @param args.text - The text content of the task to be created
 * @returns Promise<string> - The ID of the newly created task
 * @throws Error if user is not authenticated
 */
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
