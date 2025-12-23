import { client } from "@/lib/sanity"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

async function initialSync() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

  console.log('Starting initial sync from Sanity to Convex...')
  // Sincronizar usuarios
  const userUpdates = await convex.query(api.sync.syncUsersFromSanity)({})
  if(userUpdates.length > 0) {
    await convex.mutation(api.sync.applyUserSync)({ updates: userUpdates })
    console.log(`Synchronized ${userUpdates.length} users.`)
  }
  // Sincronizar solicitudes de vacaciones
  const vacationUpdates = await 
  if(vacationUpdates) {

  }
}