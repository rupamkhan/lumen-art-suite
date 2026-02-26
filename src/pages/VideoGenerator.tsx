import { useState } from "react";
import { Sparkles, Loader2, Download, Film, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast.success("Video generated successfully!");
    }, 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <Textarea
            placeholder="Describe the video you want to create... e.g., 'A cinematic drone shot flying over misty mountains at sunrise'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[120px] text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue="5s">
              <SelectTrigger className="w-28 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3s">3 sec</SelectItem>
                <SelectItem value="5s">5 sec</SelectItem>
                <SelectItem value="10s">10 sec</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="cinematic">
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
            <Select defaultValue="16:9">
              <SelectTrigger className="w-28 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} disabled={generating} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2 ml-auto">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate Video"}
            </Button>
          </div>
        </div>

        {/* Output */}
        {generating && (
          <div className="aspect-video bg-secondary rounded-xl flex flex-col items-center justify-center gap-3 animate-pulse">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Generating your video...</p>
          </div>
        )}

        {generated && !generating && (
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center relative group cursor-pointer">
              <Button size="icon" variant="ghost" className="h-16 w-16 rounded-full glass glow-blue">
                <Play className="h-7 w-7 ml-1" />
              </Button>
            </div>
            <Button variant="outline" className="gap-2 border-border/50">
              <Download className="h-4 w-4" /> Download Video
            </Button>
          </div>
        )}

        {!generating && !generated && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Film className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Describe your video and click Generate</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Video Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">Runway Gen-3</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Resolution</span><span className="text-foreground">1080p</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">FPS</span><span className="text-foreground">24</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="text-foreground">MP4</span></div>
        </div>
      </aside>
    </div>
  );
}
