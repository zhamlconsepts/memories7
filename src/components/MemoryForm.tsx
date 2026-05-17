import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { fileToBase64 } from "@/lib/file-utils";

const memorySchema = z.object({
  name: z.string().min(1, "Ismingizni kiriting"),
  message: z.string().min(1, "Xotirangizni kiriting"),
});

export type MemoryFormData = z.infer<typeof memorySchema> & {
  imageData?: string | null;
};

interface MemoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MemoryFormData) => void;
  isSubmitting?: boolean;
  initialData?: { name?: string; message?: string; imageData?: string | null };
  isEditing?: boolean;
}

export function MemoryForm({ open, onOpenChange, onSubmit, isSubmitting = false, initialData, isEditing = false }: MemoryFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageData || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof memorySchema>>({
    resolver: zodResolver(memorySchema),
    defaultValues: { name: initialData?.name || "", message: initialData?.message || "" },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({ name: initialData.name || "", message: initialData.message || "" });
        setImagePreview(initialData.imageData || null);
      } else {
        form.reset({ name: "", message: "" });
        setImagePreview(null);
      }
    }
  }, [open, initialData, form]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch (err) {
        console.error("Failed to read file", err);
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (values: z.infer<typeof memorySchema>) => {
    onSubmit({ ...values, imageData: imagePreview });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="neon-text text-2xl font-bold">
            {isEditing ? "Xotirani tahrirlash" : "Xotira qoldirish"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing ? "Xotirangizni yangilang." : "Jamshid bilan o'tgan yorqin onlarni biz bilan baham ko'ring."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Ismingiz</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sizning ismingiz"
                      {...field}
                      disabled={isEditing || isSubmitting}
                      className="bg-card border-primary/20 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Xotirangiz</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="U bilan qanday yorqin xotirangiz bor?"
                      className="min-h-[120px] resize-none bg-card border-primary/20 focus-visible:ring-primary focus-visible:border-primary transition-all"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium leading-none text-foreground/80">
                Rasm qo'shish (ixtiyoriy)
              </label>

              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-primary/20 bg-black/40 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[200px] object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="sm" onClick={removeImage} className="gap-2">
                      <X className="w-4 h-4" /> Olib tashlash
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-primary/20 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="w-8 h-8 text-primary/60" />
                  <span className="text-sm text-muted-foreground">Rasm yuklash uchun bosing</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} disabled={isSubmitting} />
            </div>

            <Button
              type="submit"
              className="w-full neon-button bg-primary text-primary-foreground font-semibold text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Yuborilmoqda..." : isEditing ? "Saqlash" : "Yuborish"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
