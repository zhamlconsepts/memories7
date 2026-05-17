import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, isDeleting = false }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-destructive/30 bg-background/95 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Xotirani o'chirishni tasdiqlaysizmi?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu amalni ortga qaytarib bo'lmaydi. Xotira butunlay o'chib ketadi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="border-primary/20 hover:bg-primary/10">
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); onConfirm(); }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
