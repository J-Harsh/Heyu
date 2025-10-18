import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.optional(v.string()),
        role: v.optional(v.union(v.literal("candidate"), v.literal("interviewer"))),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db.query("users").filter(query => query.eq(query.field("clerkId"), args.clerkId)).first();
        if (existingUser) {
            // Update existing user's information BUT NOT their role
            // Role is locked after initial creation
            await ctx.db.patch(existingUser._id, {
                email: args.email,
                name: args.name,
                image: args.image,
                // role is intentionally omitted - it never changes after creation
            });
            return;
        }
        // New user - set their role from metadata if provided, otherwise leave undefined
        // User will be redirected to onboarding page to select role
        const newUser: any = {
            clerkId: args.clerkId,
            email: args.email,
            name: args.name,
            createdAt: Date.now(),
        };

        if (args.image) newUser.image = args.image;
        if (args.role) newUser.role = args.role;

        await ctx.db.insert("users", newUser);
    },
});

export const getUsers = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");
        const users = await ctx.db.query("users").collect()
        return users
    }
})

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");
        const users = await ctx.db.query("users").withIndex("by_clerk_id", (query) => query
            .eq("clerkId", args.clerkId))
            .first();
        return users
    }
})

export const updateUserRole = mutation({
    args: {
        clerkId: v.string(),
        role: v.union(v.literal("candidate"), v.literal("interviewer")),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
            .withIndex("by_clerk_id", (query) => query.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            role: args.role,
        });

        return user._id;
    }
})