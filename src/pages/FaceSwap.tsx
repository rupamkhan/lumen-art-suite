import { useState, useRef } from "react";
import { Upload, Download, Loader2, Users, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FaceSwap() {
  const [basePreview, setBasePreview] = useState<string | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const baseRef = useRef<HTMLInputElement>(null);
  const faceRef = useRef<HTMLInputElement>(null);

  const handleBase = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setBasePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFace = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setFacePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSwap = () => {
    if (!basePreview || !facePreview) return toast.error("Please upload both images");
    toast.info("Face swap requires a dedicated API (e.g., InsightFace). This feature will be available soon with a specialized model.", {
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <input ref={baseRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleBase(e.target.files[0])} />
      <input ref={faceRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFace(e.target.files[0])} />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => baseRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 cursor-pointer transition-colors ${basePreview ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/50"}`}
          >
            {basePreview ? (
              <img src={basePreview} alt="Base" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <div className="h-12 w-12 rounded-xl glass flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium text-sm">Upload Base Image</p>
                <p className="text-xs text-muted-foreground mt-1">The image to modify</p>
              </>
            )}
          </div>
          <div
            onClick={() => faceRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 cursor-pointer transition-colors ${facePreview ? "border-accent/50 bg-accent/5" : "border-border/50 hover:border-accent/50"}`}
          >
            {facePreview ? (
              <img src={facePreview} alt="Face" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <div className="h-12 w-12 rounded-xl glass flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium text-sm">Upload Face Image</p>
                <p className="text-xs text-muted-foreground mt-1">The face to swap in</p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSwap} disabled={!basePreview || !facePreview} className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
            <Users className="h-4 w-4" /> Swap Face
          </Button>
        </div>

        <div className="glass rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Face swap uses InsightFace model. Upload both images to proceed.</p>
        </div>
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Face Swap Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">InsightFace</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">High</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Blend</span><span className="text-foreground">Seamless</span></div>
        </div>
      </aside>
    </div>
  );
}
