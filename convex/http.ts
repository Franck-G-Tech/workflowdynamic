import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from '@clerk/backend';
import { Webhook } from 'svix';

const http = httpRouter();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const event = await validateRequest(request);
      if (!event) {
        console.error('Failed to validate webhook request');
        return new Response('Invalid webhook signature', { status: 401 });
      }

      switch (event.type) {
        case 'user.created': {
          const userData = event.data;
          await ctx.runMutation(internal.Users.upsertFromClerk, {
            event_type: event.type,
            data: { ...event.data },
          });

          const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          const email = userData.email_addresses?.[0]?.email_address || "";

          await ctx.runAction(internal.sanityIntegration.createSanityUser, {
            clerkId: event.data.id,
            name: fullName || "Usuario sin nombre",
            email: email,
            avatarUrl: userData.image_url,
            data: { ...event.data }
          });

          break;
        }

        case 'user.updated': {
          await ctx.runMutation(internal.Users.upsertFromClerk, {
            event_type: event.type,
            data: { ...event.data },
          });

          break;
        }

        case 'user.deleted': {
          const clerkUserId = event.data.id;
          if (!clerkUserId) {
            console.error('No Clerk user ID provided for deletion');
            return new Response('Missing Clerk user ID', { status: 400 });
          }

          await ctx.runMutation(internal.Users.deleteFromClerk, {
            clerkUserId,
          });

          break;
        }

        default:
          break;
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }),
});

// Función de utilidad para validar la firma de la solicitud
async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };

  // Verifica que todos los headers necesarios estén presentes
  if (
    !svixHeaders['svix-id'] ||
    !svixHeaders['svix-timestamp'] ||
    !svixHeaders['svix-signature']
  ) {
    console.error('Missing required svix headers');
    return null;
  }

  // Crea una instancia del webhook con el secreto de tu variable de entorno
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook event', error);
    return null;
  }
}

/////////////////////////////////////////////////////////////////////////////////



export default http;