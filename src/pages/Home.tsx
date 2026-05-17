import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMemories, useCreateMemory, useUpdateMemory, useDeleteMemory } from "@/hooks/use-memories";
import { saveToken, getToken, removeToken } from "@/lib/token-store";
import { MemoryCard } from "@/components/MemoryCard";
import { MemoryForm, type MemoryFormData } from "@/components/MemoryForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Footer } from "@/components/Footer";
import type { Memory } from "@/lib/api";

export default function Home() {
  const { toast } = useToast();
  const { data: memories, isLoading } = useMemories();

  const createMemory = useCreateMemory();
  const updateMemory = useUpdateMemory();
  const deleteMemory = useDeleteMemory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMemoryId, setDeletingMemoryId] = useState<number | null>(null);

  const handleOpenCreate = () => {
    setEditingMemory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (memoryId: number) => {
    setDeletingMemoryId(memoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: MemoryFormData) => {
    if (editingMemory) {
      const editToken = getToken(editingMemory.id);
      if (!editToken) {
        toast({ title: "Xato", description: "Sizda ushbu xotirani tahrirlash huquqi yo'q", variant: "destructive" });
        return;
      }
      updateMemory.mutate(
        { id: editingMemory.id, editToken, message: data.message, imageData: data.imageData },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingMemory(null);
            toast({ title: "Muvaffaqiyatli", description: "Xotira yangilandi" });
          },
          onError: (err) => {
            toast({ title: "Xato", description: err.message, variant: "destructive" });
          },
        }
      );
    } else {
      createMemory.mutate(data, {
        onSuccess: (result) => {
          saveToken(result.id, result.editToken);
          setIsFormOpen(false);
          toast({ title: "Muvaffaqiyatli", description: "Xotira qo'shildi" });
        },
        onError: (err) => {
          toast({ title: "Xato", description: err.message, variant: "destructive" });
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingMemoryId) return;
    const editToken = getToken(deletingMemoryId);
    if (!editToken) {
      toast({ title: "Xato", description: "Sizda ushbu xotirani o'chirish huquqi yo'q", variant: "destructive" });
      setIsDeleteDialogOpen(false);
      return;
    }
    deleteMemory.mutate(
      { id: deletingMemoryId, editToken },
      {
        onSuccess: () => {
          removeToken(deletingMemoryId);
          setIsDeleteDialogOpen(false);
          setDeletingMemoryId(null);
          toast({ title: "Muvaffaqiyatli", description: "Xotira o'chirildi" });
        },
        onError: (err) => {
          toast({ title: "Xato", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 neon-text">
              Jamshid bilan yorqin xotirangizni qoldiring
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Bu yerda biz uchun qadrli inson bilan bog'liq eng iliq xotiralar jamlangan.
              Siz ham o'z his-tuyg'ularingiz bilan bo'lishing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              size="lg"
              className="neon-button bg-primary text-primary-foreground font-semibold text-lg px-8 py-6 rounded-full"
              onClick={handleOpenCreate}
            >
              <Plus className="mr-2 h-5 w-5" />
              Xotira qoldirish
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12 bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6 text-center backdrop-blur-sm"
        >
          <p className="text-primary/90 font-medium tracking-wide flex items-center justify-center gap-2 text-sm md:text-base">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Saytga kirgan har bir kimsa sizning xotirangizni ko'rish imkoniga ega
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-card/50 border border-primary/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {memories?.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  canEdit={!!getToken(memory.id)}
                  onEdit={() => handleOpenEdit(memory)}
                  onDelete={() => handleOpenDelete(memory.id)}
                />
              ))}
            </AnimatePresence>

            {memories?.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 animate-ping" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Hozircha xotiralar yo'q</h3>
                <p className="text-muted-foreground">Birinchi bo'lib o'z xotirangizni qoldiring.</p>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <Footer />

      <MemoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={createMemory.isPending || updateMemory.isPending}
        isEditing={!!editingMemory}
        initialData={
          editingMemory
            ? { name: editingMemory.name, message: editingMemory.message, imageData: editingMemory.imageData }
            : undefined
        }
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMemory.isPending}
      />
    </div>
  );
}
