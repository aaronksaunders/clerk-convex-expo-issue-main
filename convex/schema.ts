import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    owner: v.string(),
    createdAt: v.number(),
  }).index("by_owner", ["owner"]),
});
