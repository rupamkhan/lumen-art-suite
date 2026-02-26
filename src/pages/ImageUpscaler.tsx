import { useState } from "react";
import { Upload, Download, Loader2, ZoomIn, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImageUpscaler() {
  const [hasFile, setHasFile] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [scale, setScale] = useState("4x");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHasFile(true);
    setProcessed(false);
    toast.success("Image loaded!");
  };

  const handleUpscale = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      toast.success(`Image upscaled to ${scale} successfully!`);
    }, 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {!hasFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => setHasFile(true)}
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
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Original</p>
                  <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">512×512</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-lg flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground/30" />
                </div>
              </div>
              <div className="glass rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Upscaled</p>
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">{scale === "4x" ? "2048×2048" : "1024×1024"}</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-lg flex items-center justify-center">
                  {processed ? <Image className="h-12 w-12 text-muted-foreground/30" /> : <ZoomIn className="h-12 w-12 text-muted-foreground/30" />}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleUpscale} disabled={processing} className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ZoomIn className="h-4 w-4" />}
                {processing ? "Upscaling..." : `Upscale to ${scale === "4x" ? "4K" : "2K"}`}
              </Button>
              <Button variant="outline" disabled={!processed} className="gap-2 border-border/50">
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
            <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">Real-ESRGAN</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Output</span><span className="text-foreground">PNG</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}
