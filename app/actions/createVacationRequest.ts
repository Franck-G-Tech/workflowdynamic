'use server'

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Helper to parse "YYYY-MM-DD" to timestamp (number) for Convex
function parseDateToTimestamp(dateStr: string): number {
    return new Date(dateStr).getTime();
}

export async function createVacationRequest(prevState: any, formData: FormData) {
  try {
    const sanityUserId = formData.get('sanityUserId') as string;
    const startDay = formData.get('startDay') as string;
    const endDay = formData.get('endDay') as string;
    const description = formData.get('description') as string;
    // We need the clerkId to sync with Convex. 
    // Ideally passed from the form or re-fetched.
    // For now, let's assume we can pass it via hidden input too, 
    // OR we just trust the sanitizeUserId logic.
    // BETTER: Pass clerkId as hidden input from the page.
    const clerkId = formData.get('clerkUserId') as string;

    if (!sanityUserId || !startDay || !endDay) {
      return { message: "Faltan datos requeridos" };
    }

    // 1. Create in Sanity
    const doc = {
      _type: 'vacationRequest',
      user_id: {
        _type: 'reference',
        _ref: sanityUserId,
      },
      start_day: startDay,
      end_day: endDay,
      description: description,
      status: 'progress', 
      answers: [], 
    };

    await client.create(doc);

    // 2. Sync to Convex (Best Effort)
    if (process.env.NEXT_PUBLIC_CONVEX_URL && clerkId) {
        try {
            await convex.mutation(api.requests.createRequest, {
                clerk_id: clerkId,
                description: description,
                start_day: parseDateToTimestamp(startDay),
                end_day: parseDateToTimestamp(endDay),
            });
        } catch (convexError) {
            console.error("Error syncing to Convex:", convexError);
            // We do NOT fail the request if Convex sync fails, but we log it.
        }
    }

    revalidatePath('/requests'); 
    return { success: true, message: "Solicitud creada exitosamente" };
  } catch (error: any) {
    console.error("Error creating vacation request:", error);
    return { 
        message: `Error al crear la solicitud: ${error.message || 'Error desconocido'}` 
    };
  }
}
