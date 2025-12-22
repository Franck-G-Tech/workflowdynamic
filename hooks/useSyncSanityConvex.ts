import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect } from "react"

export function useSyncSanityConvex() {
  const userSyncUpadte = useQuery(api.sync.syncUsersFromSanity)
}