import { useState, useRef } from "react";
import { Upload, Download, Loader2, Eraser, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { uploadToCloudinary, saveToHistory, saveToMediaLibrary } from "@/lib/cloudinary";

export default function BackgroundRemover() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    if (!originalPreview) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("remove-background", {
        body: { imageBase64: originalPreview },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResultImage(data.image);
      toast.success("Background removed!");

      if (user && data.image) {
        const cloudUrl = await uploadToCloudinary(data.image, "omnicraft/bg-removed");
        const finalUrl = cloudUrl || data.image;
        await saveToHistory(user.id, "bg-remover", "Background removal", finalUrl);
        await saveToMediaLibrary(user.id, "BG Removed Image", "image", finalUrl, null, "bg-remover");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Background removal failed. Please try again.", {
        description: "The AI model may be loading. Wait a moment and retry.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `omnicraft-bg-removed-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />

        {!originalPreview ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect(file);
            }}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center py-24 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="h-16 w-16 rounded-2xl glass flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Drop your image here</p>
            <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Original</p>
                <img src={originalPreview} alt="Original" className="w-full aspect-square object-contain rounded-lg bg-secondary" />
              </div>
              <div className="glass rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Result</p>
                <div className="aspect-square rounded-lg flex items-center justify-center" style={{ backgroundImage: "repeating-conic-gradient(hsl(var(--secondary)) 0% 25%, transparent 0% 50%)", backgroundSize: "20px 20px" }}>
                  {resultImage ? (
                    <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                  ) : (
                    <Eraser className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRemove} disabled={processing} className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eraser className="h-4 w-4" />}
                {processing ? "Removing..." : "Remove Background"}
              </Button>
              <Button variant="outline" disabled={!resultImage} onClick={downloadImage} className="gap-2 border-border/50">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">BRIA RMBG 1.4</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Output Format</span><span className="text-foreground">PNG</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Transparency</span><span className="text-foreground">Yes</span></div>
        </div>
      </aside>
    </div>
  );
}
