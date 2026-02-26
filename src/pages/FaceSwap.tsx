import { useState } from "react";
import { Upload, Download, Loader2, Users, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FaceSwap() {
  const [baseImage, setBaseImage] = useState(false);
  const [faceImage, setFaceImage] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleSwap = () => {
    if (!baseImage || !faceImage) return toast.error("Please upload both images");
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      toast.success("Face swapped successfully!");
    }, 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Image */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); setBaseImage(true); setProcessed(false); toast.success("Base image loaded!"); }}
            onClick={() => { setBaseImage(true); setProcessed(false); }}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 cursor-pointer transition-colors ${baseImage ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/50"}`}
          >
            <div className="h-12 w-12 rounded-xl glass flex items-center justify-center mb-3">
              {baseImage ? <Image className="h-6 w-6 text-primary" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
            </div>
            <p className="text-foreground font-medium text-sm">{baseImage ? "Base Image Loaded" : "Upload Base Image"}</p>
            <p className="text-xs text-muted-foreground mt-1">The image to modify</p>
          </div>

          {/* Face Image */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); setFaceImage(true); setProcessed(false); toast.success("Face image loaded!"); }}
            onClick={() => { setFaceImage(true); setProcessed(false); }}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 cursor-pointer transition-colors ${faceImage ? "border-accent/50 bg-accent/5" : "border-border/50 hover:border-accent/50"}`}
          >
            <div className="h-12 w-12 rounded-xl glass flex items-center justify-center mb-3">
              {faceImage ? <Image className="h-6 w-6 text-accent" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
            </div>
            <p className="text-foreground font-medium text-sm">{faceImage ? "Face Image Loaded" : "Upload Face Image"}</p>
            <p className="text-xs text-muted-foreground mt-1">The face to swap in</p>
          </div>
        </div>

        {/* Result */}
        {processed && (
          <div className="glass rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Result</p>
            <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-lg flex items-center justify-center">
              <Users className="h-12 w-12 text-muted-foreground/30" />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSwap} disabled={processing || !baseImage || !faceImage} className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            {processing ? "Swapping..." : "Swap Face"}
          </Button>
          <Button variant="outline" disabled={!processed} className="gap-2 border-border/50">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Face Swap Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">InsightFace</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">High</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Blend Mode</span><span className="text-foreground">Seamless</span></div>
        </div>
      </aside>
    </div>
  );
}
