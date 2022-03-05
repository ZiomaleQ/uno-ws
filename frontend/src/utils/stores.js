import { writable } from "svelte/store"

export const ID = writable("")
export const Room = writable({})
export const Spectate = writable(false)
export const GameData = writable({ active: false })