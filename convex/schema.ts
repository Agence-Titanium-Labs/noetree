import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    picture: v.optional(v.string()),
    nickname: v.optional(v.string()),
    given_name: v.optional(v.string()),
    updated_at: v.optional(v.string()),
    family_name: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    email_verified: v.optional(v.boolean()),
    phone_number_verified: v.optional(v.boolean()),
    role: v.id("roles")
  }).index("by_token", ["tokenIdentifier"]),

  roles: defineTable({
    role: v.string()
  }),

  notes: defineTable({
    childNotes: v.optional(v.array(v.id("notes"))),
    content: v.string(),
    created_at: v.optional(v.string()),
    owner: v.id("users"),
    parentNote: v.optional(v.id("notes")),
    title: v.string(),
    updated_at: v.optional(v.string())
  })
    .index("by_owner", ["owner", "parentNote"])
    .index("by_parent", ["parentNote"])
});
