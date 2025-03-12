import { query } from "./_generated/server";
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const getNoteById = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("_id"), args.id));
    return note;
  }
});

export const getNotesByUserID = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("owner"), args.userId))
      .order("desc");
    return notes;
  }
});

export const createNote = mutation({
  args: {
    owner: v.id("users"),
    content: v.any(),
    parentNote: v.optional(v.id("notes")),
    childNotes: v.optional(v.array(v.id("notes")))
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.insert("notes", {
      owner: args.owner,
      content: args.content,
      parentNote: args.parentNote,
      childNotes: args.childNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return note;
  }
});

export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    content: v.any(),
    parentNote: v.optional(v.id("notes")),
    childNotes: v.optional(v.array(v.id("notes")))
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.patch(args.id, {
      content: args.content,
      parentNote: args.parentNote,
      childNotes: args.childNotes,
      updated_at: new Date().toISOString()
    });
    return note;
  }
});

export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  }
});

export const updateParentNote = mutation({
  args: {
    id: v.id("notes"),
    parentNote: v.optional(v.id("notes"))
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.patch(args.id, {
      parentNote: args.parentNote,
      updated_at: new Date().toISOString()
    });
    return note;
  }
});

export const updateChildNotes = mutation({
  args: {
    id: v.id("notes"),
    childNotes: v.optional(v.array(v.id("notes")))
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.patch(args.id, {
      childNotes: args.childNotes,
      updated_at: new Date().toISOString()
    });
    return note;
  }
});

export const moveNote = mutation({
  args: {
    id: v.id("notes"),
    from: v.id("notes"),
    to: v.id("notes")
  },
  handler: async (ctx, args) => {
    // remove from childNotes of from
    const noteFrom = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("_id"), args.from))
      .first();

    const noteTo = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("_id"), args.to))
      .first();

    if (!noteFrom || !noteTo) {
      throw new Error("Note not found");
    }

    if (!noteFrom.childNotes) {
      throw new Error("Note does not have childNotes");
    }

    const newChildrenNotesFrom = noteFrom.childNotes.filter(
      id => id !== args.id
    );

    await ctx.db.patch(args.from, {
      childNotes: newChildrenNotesFrom
    });

    const newChildrenNotesTo = noteTo.childNotes
      ? [...noteTo.childNotes, args.id]
      : [args.id];

    // add to childNotes of to
    await ctx.db.patch(args.to, {
      childNotes: newChildrenNotesTo
    });

    const note = await ctx.db.patch(args.id, {
      parentNote: args.to
    });
    return note;
  }
});
