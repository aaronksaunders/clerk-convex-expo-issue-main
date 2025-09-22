import { query } from "./_generated/server";

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
