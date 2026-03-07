import { useState } from "react";
import { Sparkles, Loader2, Download, Film } from "lucide-react";
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
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultType, setResultType] = useState<"video" | "image">("video");
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    setGenerating(true);
    setResultUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-video", {
        body: { prompt, style },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const url = data.video || data.image;
      const type = data.video ? "video" : "image";
      setResultUrl(url);
      setResultType(type);
      toast.success(type === "video" ? "Video generated!" : "Cinematic frame generated!");

      if (user && url) {
        const cloudUrl = await uploadToCloudinary(url, "omnicraft/videos");
        const finalUrl = cloudUrl || url;
        await saveToHistory(user.id, "video-generator", prompt, finalUrl);
        await saveToMediaLibrary(user.id, prompt.slice(0, 50), type, finalUrl, prompt, "video-generator");
      }
    } catch {
      toast.error("Generation failed. Please try again.", {
        description: "The AI model may be loading. Wait a moment and retry.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `omnicraft-video-${Date.now()}.${resultType === "video" ? "mp4" : "png"}`;
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
              {generating ? "Synthesizing Video..." : "Generate Video"}
            </Button>
          </div>
        </div>

        {generating && (
          <div className="aspect-video bg-secondary rounded-xl flex flex-col items-center justify-center gap-3 animate-pulse">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Synthesizing your video… this may take a moment</p>
          </div>
        )}

        {resultUrl && !generating && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-border/50">
              {resultType === "video" ? (
                <video src={resultUrl} controls autoPlay loop className="w-full aspect-video object-cover" />
              ) : (
                <img src={resultUrl} alt="Generated frame" className="w-full aspect-video object-cover" />
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={downloadResult} className="gap-2 border-border/50">
                <Download className="h-4 w-4" /> Download {resultType === "video" ? "Video" : "Frame"}
              </Button>
            </div>
          </div>
        )}

        {!generating && !resultUrl && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Film className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Describe your scene and click Generate</p>
            <p className="text-xs text-muted-foreground mt-1">Generates video via AI text-to-video pipeline</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Video Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">AI Video Gen</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Output</span><span className="text-foreground">MP4 / Frame</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">HD</span></div>
        </div>
      </aside>
    </div>
  );
}
