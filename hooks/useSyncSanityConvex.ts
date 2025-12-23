import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect } from "react"

export function useSyncSanityConvex() {
  const userSyncUpadte = useQuery(api.sync.syncUsersFromSanity)
  const vacationSyncUpdate = useQuery(api.vacationRequestSync.syncVacationRequests)

  const applyUserSync = useMutation(api.sync.applyUserSync)
  const applyVacationSync = useMutation(api.syncVacationRequests.applyVacationRequestSync)
 
  const syncAll = async () => {
    try {
      if(userSyncUpadte && userSyncUpadte.length > 0) {
        await applyUserSync({ updates: userSyncUpadte })
      }

      if(vacationSyncUpdate && vacationSyncUpdate.length > 0) {
        await applyVacationSync({ updates: vacationSyncUpdate })
      }

      return { succes: true }
    } catch (error) {
      console.error("Sync error:", error)
      return { succes: false, error }
    }
  }
  // Sincronización autómatica cada 5 minutos
  useEffect(() => {
    const interval = setInterval(syncAll, 5 * 60 * 1000)
    return () => clearInterval(interval)

  }, [])

  return { syncAll, userSyncUpadte, vacationSyncUpdate }
}