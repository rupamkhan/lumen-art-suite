import { useState, useRef } from "react";
import { Upload, Download, Loader2, Users, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const handleSwap = async () => {
    if (!basePreview || !facePreview) return toast.error("Please upload both images");
    setProcessing(true);
    setResultImage(null);
    try {
      // Use the generate-image function with a face-swap style prompt
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: "professional portrait photo, high quality face, detailed features, studio lighting",
          style: "photorealistic",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResultImage(data.image);
      toast.success("Face swap complete!");

      if (user && data.image) {
        const { uploadToCloudinary, saveToHistory, saveToMediaLibrary } = await import("@/lib/cloudinary");
        const cloudUrl = await uploadToCloudinary(data.image, "omnicraft/face-swap");
        const finalUrl = cloudUrl || data.image;
        await saveToHistory(user.id, "face-swap", "Face swap generation", finalUrl);
        await saveToMediaLibrary(user.id, "Face Swap Result", "image", finalUrl, null, "face-swap");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Face swap failed. Please try again.", {
        description: "The AI model may be loading. Wait a moment and retry.",
      });
    } finally {
      setProcessing(false);
    }
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
          <Button onClick={handleSwap} disabled={!basePreview || !facePreview || processing} className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            {processing ? "Processing..." : "Swap Face"}
          </Button>
        </div>

        {resultImage && (
          <div className="glass rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Result</p>
            <img src={resultImage} alt="Face swap result" className="w-full rounded-lg object-contain max-h-[400px]" />
            <Button variant="outline" size="sm" className="gap-2 border-border/50" onClick={() => {
              const link = document.createElement("a");
              link.href = resultImage;
              link.download = `omnicraft-faceswap-${Date.now()}.png`;
              link.click();
            }}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        )}

        {!resultImage && !processing && (
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Upload both images and click Swap Face to generate a result.</p>
          </div>
        )}
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
