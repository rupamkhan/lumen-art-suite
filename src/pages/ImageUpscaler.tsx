import { useState, useRef } from "react";
import { Upload, Download, Loader2, ZoomIn, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { uploadToCloudinary, saveToHistory, saveToMediaLibrary } from "@/lib/cloudinary";

export default function ImageUpscaler() {
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scale, setScale] = useState("4x");
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

  const handleUpscale = async () => {
    if (!originalPreview) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("upscale-image", {
        body: { imageBase64: originalPreview },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResultImage(data.image);
      toast.success(`Image upscaled to ${scale}!`);

      if (user && data.image) {
        const cloudUrl = await uploadToCloudinary(data.image, "omnicraft/upscaled");
        const finalUrl = cloudUrl || data.image;
        await saveToHistory(user.id, "image-upscaler", `Upscaled ${scale}`, finalUrl);
        await saveToMediaLibrary(user.id, `Upscaled ${scale}`, "image", finalUrl, null, "image-upscaler");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Upscaling failed. Please try again.", {
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
    link.download = `omnicraft-upscaled-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {!originalPreview ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center py-24 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="h-16 w-16 rounded-2xl glass flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Drop your image here</p>
            <p className="text-sm text-muted-foreground mt-1">Upload a low-resolution image to upscale</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Original</p>
                <img src={originalPreview} alt="Original" className="w-full aspect-square object-contain rounded-lg bg-secondary" />
              </div>
              <div className="glass rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Upscaled</p>
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">{scale}</span>
                </div>
                <div className="aspect-square rounded-lg flex items-center justify-center bg-secondary">
                  {resultImage ? <img src={resultImage} alt="Upscaled" className="w-full h-full object-contain" /> : <ZoomIn className="h-12 w-12 text-muted-foreground/30" />}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleUpscale} disabled={processing} className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ZoomIn className="h-4 w-4" />}
                {processing ? "Upscaling..." : `Upscale to ${scale}`}
              </Button>
              <Button variant="outline" disabled={!resultImage} onClick={downloadImage} className="gap-2 border-border/50">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Upscale Settings</h3>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Scale Factor</p>
          <div className="flex gap-2">
            {["2x", "4x"].map((s) => (
              <button key={s} onClick={() => setScale(s)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${scale === s ? "gradient-primary text-primary-foreground glow-gradient" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="space-y-2 text-sm pt-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">Swin2SR</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Output</span><span className="text-foreground">PNG</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}
