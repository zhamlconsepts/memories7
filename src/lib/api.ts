export interface Memory {
  id: number;
  name: string;
  message: string;
  imageData: string | null;
  createdAt: string;
}

export interface MemoryWithToken extends Memory {
  editToken: string;
}

const BASE = "/api/memories";

export async function fetchMemories(): Promise<Memory[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Xotiralarni yuklashda xatolik");
  return res.json();
}

export async function createMemory(data: {
  name: string;
  message: string;
  imageData?: string | null;
}): Promise<MemoryWithToken> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Xatolik yuz berdi");
  }
  return res.json();
}

export async function updateMemory(
  id: number,
  data: { editToken: string; message?: string; imageData?: string | null }
): Promise<Memory> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Xatolik yuz berdi");
  }
  return res.json();
}

export async function deleteMemory(id: number, editToken: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ editToken }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Xatolik yuz berdi");
  }
}
