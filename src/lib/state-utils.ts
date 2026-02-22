import { allStates } from '@/data/states'

// Map state codes to full names — usable from both server and client
export function getStateName(code: string): string {
  const state = allStates.find(s => s.code === code)
  return state?.name || code
}
