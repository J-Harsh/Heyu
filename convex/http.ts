import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api"

const http = httpRouter();

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            return new Response("CLERK_WEBHOOK_SECRET is not set", { status: 500 });
        }
        const svix_id = request.headers.get("svix-id");
        const svix_timestamp = request.headers.get("svix-timestamp");
        const svix_signature = request.headers.get("svix-signature");
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response("No svix header is present", { status: 400 });
        }
        const payload = await request.json();
        const body = JSON.stringify(payload);
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            return new Response("Invalid signature", { status: 400 });
        }
        const eventType = evt.type;
        switch (eventType) {
            case "user.created":
                {
                    const { id, email_addresses, image_url, first_name, last_name, unsafe_metadata } = evt.data;
                    const email = email_addresses[0].email_address;
                    const name = [first_name, last_name].filter(Boolean).join(" ") || email;

                    // Extract role from Clerk metadata (only on creation)
                    const role = unsafe_metadata?.role as 'candidate' | 'interviewer' | undefined;

                    try {
                        await ctx.runMutation(api.users.syncUser, {
                            clerkId: id,
                            email,
                            name,
                            image: image_url,
                            role: role, // Pass role from Clerk metadata
                        });
                    }
                    catch (err) {
                        console.log("Error creating user", err);
                        return new Response("Error creating user", { status: 500 });
                    }
                }
                break;
            case "user.updated":
                {
                    const { id, email_addresses, image_url, first_name, last_name, unsafe_metadata } = evt.data;
                    const email = email_addresses[0].email_address;
                    const name = [first_name, last_name].filter(Boolean).join(" ") || email;

                    // Extract role from Clerk metadata if it was just set
                    const role = unsafe_metadata?.role as 'candidate' | 'interviewer' | undefined;

                    try {
                        // If role is present in metadata, update it in the database
                        if (role) {
                            await ctx.runMutation(api.users.updateUserRole, {
                                clerkId: id,
                                role: role,
                            });
                        }

                        // Sync other user information
                        await ctx.runMutation(api.users.syncUser, {
                            clerkId: id,
                            email,
                            name,
                            image: image_url,
                        });
                    }
                    catch (err) {
                        console.log("Error updating user", err);
                        return new Response("Error updating user", { status: 500 });
                    }
                }
        }

        return new Response("Webhook processed", { status: 200 });
    }),
});

export default http;