import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all notifications for the current user
export const getMyNotifications = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        // Get user to verify they are a candidate
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user || user.role !== "candidate") {
            return [];
        }

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .collect();

        // Enhance notifications with interview details
        const enhancedNotifications = await Promise.all(
            notifications.map(async (notification) => {
                const interview = await ctx.db.get(notification.interviewId);
                return {
                    ...notification,
                    interviewTitle: interview?.title || "Unknown Interview",
                };
            })
        );

        return enhancedNotifications;
    },
});

// Query to get unread notification count
export const getUnreadCount = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return 0;

        // Get user to verify they are a candidate
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user || user.role !== "candidate") {
            return 0;
        }

        const unreadNotifications = await ctx.db
            .query("notifications")
            .withIndex("by_user_and_read", (q) =>
                q.eq("userId", identity.subject).eq("isRead", false)
            )
            .collect();

        return unreadNotifications.length;
    },
});

// Mutation to mark a notification as read
export const markAsRead = mutation({
    args: {
        notificationId: v.id("notifications"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const notification = await ctx.db.get(args.notificationId);
        if (!notification) throw new Error("Notification not found");

        // Verify the notification belongs to the current user
        if (notification.userId !== identity.subject) {
            throw new Error("Unauthorized to mark this notification as read");
        }

        await ctx.db.patch(args.notificationId, {
            isRead: true,
        });
    },
});

// Mutation to mark all notifications as read
export const markAllAsRead = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const unreadNotifications = await ctx.db
            .query("notifications")
            .withIndex("by_user_and_read", (q) =>
                q.eq("userId", identity.subject).eq("isRead", false)
            )
            .collect();

        await Promise.all(
            unreadNotifications.map((notification) =>
                ctx.db.patch(notification._id, { isRead: true })
            )
        );
    },
});

// Internal mutation to create a notification (called from other mutations)
export const createNotification = mutation({
    args: {
        userId: v.string(),
        type: v.union(v.literal("comment"), v.literal("review")),
        interviewId: v.id("interviews"),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("notifications", {
            userId: args.userId,
            type: args.type,
            interviewId: args.interviewId,
            message: args.message,
            isRead: false,
            createdAt: Date.now(),
        });
    },
});

