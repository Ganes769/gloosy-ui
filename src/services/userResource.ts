import { getCurrentUser } from "./api";

export function fetchCurrentUser() {
  return getCurrentUser(); // must return a Promise
}
