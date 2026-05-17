import { forwardRef } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Memory } from "@/lib/api";

interface MemoryCardProps {
  memory: Memory;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const MemoryCard = forwardRef<HTMLDivElement, MemoryCardProps>(
  ({ memory, canEdit, onEdit, onDelete }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="neon-border rounded-xl p-6 flex flex-col gap-4 relative group overflow-hidden bg-card"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold neon-text">{memory.name}</h3>
            <time className="text-xs text-muted-foreground mt-1">
              {format(new Date(memory.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </time>
          </div>

          {canEdit && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/20"
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Tahrirlash</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">O'chirish</span>
              </Button>
            </div>
          )}
        </div>

        <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm md:text-base flex-grow">
          {memory.message}
        </p>

        {memory.imageData && (
          <div className="mt-2 rounded-lg overflow-hidden border border-primary/20 bg-black/40">
            <img
              src={memory.imageData}
              alt={`Memory from ${memory.name}`}
              className="w-full h-auto max-h-[300px] object-contain"
              loading="lazy"
            />
          </div>
        )}
      </motion.div>
    );
  }
);
MemoryCard.displayName = "MemoryCard";
