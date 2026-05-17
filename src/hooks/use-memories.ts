import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  type Memory,
  type MemoryWithToken,
} from "@/lib/api";

export const MEMORIES_KEY = ["memories"] as const;

export function useMemories() {
  return useQuery<Memory[]>({
    queryKey: MEMORIES_KEY,
    queryFn: fetchMemories,
  });
}

export function useCreateMemory() {
  const qc = useQueryClient();
  return useMutation<
    MemoryWithToken,
    Error,
    { name: string; message: string; imageData?: string | null }
  >({
    mutationFn: createMemory,
    onSuccess: () => qc.invalidateQueries({ queryKey: MEMORIES_KEY }),
  });
}

export function useUpdateMemory() {
  const qc = useQueryClient();
  return useMutation<
    Memory,
    Error,
    { id: number; editToken: string; message?: string; imageData?: string | null }
  >({
    mutationFn: ({ id, ...data }) => updateMemory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEMORIES_KEY }),
  });
}

export function useDeleteMemory() {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: number; editToken: string }>({
    mutationFn: ({ id, editToken }) => deleteMemory(id, editToken),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEMORIES_KEY }),
  });
}
