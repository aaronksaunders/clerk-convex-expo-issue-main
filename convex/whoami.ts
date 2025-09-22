import { query } from "./_generated/server";

/**
 * Query to get the current authenticated user's identity information
 * Returns user details from the Clerk JWT token
 * @returns Promise<Object> - User identity object containing subject, provider, and email
 * @throws Error if user is not authenticated
 */
export const whoami = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return {
      subject: identity.subject,
      provider: identity.provider,
      email: identity.email,
    };
  },
});
