"use server"

import { currentUser, clerkClient } from "@clerk/nextjs/server"
import { StreamClient } from "@stream-io/node-sdk"

export const streamTokenProvider = async () => {
    const user = await currentUser()
    if (!user) throw new Error("User not authenticated")
    const streamClient = new StreamClient(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        process.env.STREAM_SECRET_KEY!
    )
    const token = streamClient.generateUserToken({ user_id: user.id });
    return token;
}

export const updateUserRoleInClerk = async (role: 'candidate' | 'interviewer') => {
    const user = await currentUser()
    if (!user) throw new Error("User not authenticated")

    try {
        const client = await clerkClient()
        // Update user metadata in Clerk
        await client.users.updateUserMetadata(user.id, {
            unsafeMetadata: {
                role: role,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating user role in Clerk:", error);
        throw new Error("Failed to update user role");
    }
}