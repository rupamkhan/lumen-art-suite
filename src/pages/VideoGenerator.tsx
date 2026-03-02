import { useState } from "react";
import { Sparkles, Loader2, Download, Film, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { uploadToCloudinary, saveToHistory, saveToMediaLibrary } from "@/lib/cloudinary";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    setGenerating(true);
    setResultImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-video", {
        body: { prompt, style },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResultImage(data.image);
      toast.success("Cinematic frame generated!", {
        description: data.message,
      });

      if (user && data.image) {
        const cloudUrl = await uploadToCloudinary(data.image, "omnicraft/video-frames");
        const finalUrl = cloudUrl || data.image;
        await saveToHistory(user.id, "video-generator", prompt, finalUrl);
        await saveToMediaLibrary(user.id, prompt.slice(0, 50), "image", finalUrl, prompt, "video-generator");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Generation failed. Please try again.", {
        description: "The AI model may be loading. Wait a moment and retry.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `omnicraft-video-frame-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <Textarea
            placeholder="Describe the scene you want to create... e.g., 'A cinematic drone shot flying over misty mountains at sunrise'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[120px] text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-36 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="realistic">Realistic</SelectItem>
                <SelectItem value="abstract">Abstract</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} disabled={generating} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2 ml-auto">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate Frame"}
            </Button>
          </div>
        </div>

        {generating && (
          <div className="aspect-video bg-secondary rounded-xl flex flex-col items-center justify-center gap-3 animate-pulse">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Generating your cinematic frame...</p>
          </div>
        )}

        {resultImage && !generating && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-border/50">
              <img src={resultImage} alt="Generated frame" className="w-full aspect-video object-cover" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={downloadImage} className="gap-2 border-border/50">
                <Download className="h-4 w-4" /> Download Frame
              </Button>
              <Button variant="outline" onClick={() => window.open(resultImage, "_blank")} className="gap-2 border-border/50">
                <ZoomIn className="h-4 w-4" /> View Full Size
              </Button>
            </div>
          </div>
        )}

        {!generating && !resultImage && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Film className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Describe your scene and click Generate</p>
            <p className="text-xs text-muted-foreground mt-1">Generates high-quality cinematic storyboard frames</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Video Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">SDXL Cinematic</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Output</span><span className="text-foreground">Storyboard Frame</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">4K</span></div>
        </div>
      </aside>
    </div>
  );
}
