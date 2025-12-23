'use server'

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function createVacationRequest(prevState: any, formData: FormData) {
  try {
    const sanityUserId = formData.get('sanityUserId') as string;
    const startDay = formData.get('startDay') as string;
    const endDay = formData.get('endDay') as string;
    const description = formData.get('description') as string;

    if (!sanityUserId || !startDay || !endDay) {
      return { message: "Faltan datos requeridos" };
    }

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
      answers: [], // Inicialmente vacío
    };

    await client.create(doc);

    revalidatePath('/requests'); // O donde se listen
    return { success: true, message: "Solicitud creada exitosamente" };
  } catch (error: any) {
    console.error("Error creating vacation request:", error);
    return { 
        message: `Error al crear la solicitud: ${error.message || 'Error desconocido'}` 
    };
  }
}
