import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./helpers/helper";
import { Doc, Id } from "./_generated/dataModel";

type Notes = Doc<"notes">;

interface NotesToSend extends Omit<Notes, "childNotes"> {
  childNotes: NotesToSend[] | Id<"notes">[] | undefined;
}

export const getTreeById = query({
  args: {
    id: v.id("notes")
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    const note = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("owner"), user._id))
      .filter(q => q.eq(q.field("_id"), args.id))
      .first();

    if (!note) {
      throw new Error("Note not found");
    }

    return note;
  }
});

export const getTreesByMe = query({
  args: {
    deep: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    //setp 1 - get user
    const user = await getUser(ctx);

    //step 2 - check if user exists
    if (!user) {
      throw new Error("User not found");
    }

    //step 3 - get all top parent notes
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_owner", q =>
        q.eq("owner", user._id).eq("parentNote", undefined)
      )
      .order("asc")
      .collect();

    //step 4 - map current notes to be as NotesToSend
    const notesToSend: NotesToSend[] = notes.map(note => ({
      ...note,
      childNotes: note.childNotes || []
    }));

    //step 5 - check if deep is provided and if so, get the children notes until deep level
    if (args.deep) {
      // Start with the top-level notes
      let currentLevelNotes = notesToSend;

      // For each level of depth
      for (let i = 0; i < args.deep; i++) {
        const nextLevelNotes: NotesToSend[] = [];

        // Process each note at the current level
        for (const currentNote of currentLevelNotes) {
          // Fetch its children
          const childrenNotes = await ctx.db
            .query("notes")
            .withIndex("by_parent", q => q.eq("parentNote", currentNote._id))
            .collect();

          if (childrenNotes.length > 0) {
            // Convert children to NotesToSend format
            const childrenNotesToSend: NotesToSend[] = childrenNotes.map(
              childNote => ({
                ...childNote,
                childNotes: childNote.childNotes || []
              })
            );

            // Add these children to the current note
            currentNote.childNotes = childrenNotesToSend;

            // Add these children to the next level for processing
            nextLevelNotes.push(...childrenNotesToSend);
          }
        }

        // If there are no notes at the next level, we've reached the bottom of the tree
        if (nextLevelNotes.length === 0) {
          break;
        }

        // Move to the next level
        currentLevelNotes = nextLevelNotes;
      }
    }

    return notesToSend;
  }
});

export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.optional(v.any()),
    parentNote: v.optional(v.id("notes")),
    childNotes: v.optional(v.array(v.id("notes")))
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if a note with the same title exists for this user
    const existingNote = await ctx.db
      .query("notes")
      .filter(q =>
        q.and(
          q.eq(q.field("owner"), user._id),
          q.eq(q.field("title"), args.title)
        )
      )
      .first();

    if (existingNote) {
      throw new Error("A note with this title already exists");
    }

    const note = await ctx.db.insert("notes", {
      owner: user._id,
      title: args.title,
      content: args.content || "",
      parentNote: args.parentNote,
      childNotes: args.childNotes || [],
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

export const fetchNoteContent = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("_id"), args.id))
      .first();

    if (!note) {
      throw new Error("Note not found");
    }

    return note.content;
  }
});
