import { Inngest } from "inngest";

function assertValue(v: string | undefined) {
  if (v === undefined) {
    throw new Error("Falta la variable de entorno");
  }
  return v;
}

const sanity = assertValue(process.env.NEXT_PUBLIC_SANITY_DATASET);

export const inngest = new Inngest({ id: sanity });