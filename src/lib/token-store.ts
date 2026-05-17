const TOKEN_KEY_PREFIX = "jamshid_memory_token_";

export function saveToken(memoryId: number, token: string) {
  localStorage.setItem(`${TOKEN_KEY_PREFIX}${memoryId}`, token);
}

export function getToken(memoryId: number): string | null {
  return localStorage.getItem(`${TOKEN_KEY_PREFIX}${memoryId}`);
}

export function removeToken(memoryId: number) {
  localStorage.removeItem(`${TOKEN_KEY_PREFIX}${memoryId}`);
}
