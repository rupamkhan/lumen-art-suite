import { useState } from "react";
import { Sparkles, Wand2, ZoomIn, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [magicRemove, setMagicRemove] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [numImages, setNumImages] = useState([1]);
  const [style, setStyle] = useState("photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    setGenerating(true);
    setImages([]);

    try {
      const results: string[] = [];
      for (let i = 0; i < numImages[0]; i++) {
        const { data, error } = await supabase.functions.invoke("generate-image", {
          body: { prompt, style, aspect_ratio: aspectRatio },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        if (data?.image) results.push(data.image);
      }
      setImages(results);
      toast.success(`${results.length} image(s) generated!`);

      // Save to media library if logged in
      if (user && results.length > 0) {
        for (const img of results) {
          await supabase.from("media_library").insert({
            user_id: user.id,
            title: prompt.slice(0, 50),
            media_type: "image",
            url: img,
            prompt,
            tool_used: "image-generator",
          });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Generation failed. Check your API keys.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `omnicraft-${Date.now()}-${index}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <Textarea
            placeholder="Describe the image you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[100px] text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger className="w-32 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Aspect Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-40 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="digital-art">Digital Art</SelectItem>
                <SelectItem value="oil-painting">Oil Painting</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2 ml-auto"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>

        {generating && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: numImages[0] }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square rounded-xl bg-secondary animate-pulse-glow" />
            ))}
          </div>
        )}

        {images.length > 0 && !generating && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-border/50">
                <img src={img} alt={`Generated ${i + 1}`} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground glass" onClick={() => downloadImage(img, i)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground glass" onClick={() => window.open(img, "_blank")}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!generating && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Enter a prompt and click Generate to create images</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-6 glass">
        <h3 className="text-sm font-semibold text-foreground">Generation Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-neon-purple" />
              <span className="text-sm text-foreground">Magic Remove</span>
            </div>
            <Switch checked={magicRemove} onCheckedChange={setMagicRemove} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ZoomIn className="h-4 w-4 text-neon-blue" />
              <span className="text-sm text-foreground">Upscale</span>
            </div>
            <Switch checked={upscale} onCheckedChange={setUpscale} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Number of Images: {numImages[0]}</label>
            <Slider value={numImages} onValueChange={setNumImages} min={1} max={4} step={1} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Seed (optional)</label>
            <input
              type="number"
              placeholder="Random"
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
