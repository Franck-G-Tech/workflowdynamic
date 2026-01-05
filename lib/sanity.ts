import { createClient } from "next-sanity";

function assertValue(v: string | undefined) {
  if (v === undefined) {
    throw new Error("Falta la variable de entorno");
  }
  return v;
}

export const client = createClient({
  projectId: assertValue(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: assertValue(process.env.NEXT_PUBLIC_SANITY_DATASET),
  apiVersion: "2025-12-19",
  useCdn: false,
});


