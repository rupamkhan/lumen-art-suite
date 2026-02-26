import { useState } from "react";
import { Music, Sparkles, Loader2, Download, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function MusicGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return toast.error("Please describe the music you want");
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast.success("Music generated!");
    }, 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <Textarea
            placeholder="Describe the music... e.g., 'Upbeat lo-fi hip hop beat for a YouTube intro, 90 BPM'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[100px] text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue="lofi">
              <SelectTrigger className="w-36 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lofi">Lo-fi</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="chill">
              <SelectTrigger className="w-32 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chill">Chill</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30s">
              <SelectTrigger className="w-28 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15s">15 sec</SelectItem>
                <SelectItem value="30s">30 sec</SelectItem>
                <SelectItem value="60s">60 sec</SelectItem>
                <SelectItem value="120s">2 min</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} disabled={generating} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2 ml-auto">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate Music"}
            </Button>
          </div>
        </div>

        {generating && (
          <div className="glass rounded-xl p-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Composing your music...</p>
          </div>
        )}

        {generated && !generating && (
          <div className="glass rounded-xl p-6 space-y-4">
            {/* Waveform */}
            <div className="flex items-end justify-center gap-[2px] h-24">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="w-1 rounded-full gradient-primary" style={{ height: `${Math.random() * 80 + 20}%`, opacity: playing ? 1 : 0.5 }} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="glass h-10 w-10" onClick={() => setPlaying(!playing)}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <div className="flex-1 h-1 bg-secondary rounded-full"><div className="w-1/3 h-full gradient-primary rounded-full" /></div>
              <span className="text-xs text-muted-foreground">0:12 / 0:30</span>
              <Button variant="outline" size="sm" className="gap-1 border-border/50">
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
          </div>
        )}

        {!generating && !generated && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Describe your music and click Generate</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Music Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">MusicGen</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">320kbps</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="text-foreground">MP3</span></div>
        </div>
      </aside>
    </div>
  );
}
