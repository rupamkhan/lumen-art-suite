import { useState } from "react";
import { Music2, Sparkles, Loader2, Download, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SongCreator() {
  const [lyrics, setLyrics] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleCreate = () => {
    if (!lyrics.trim()) return toast.error("Please enter lyrics");
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast.success("Song created!");
    }, 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Lyrics</label>
          <Textarea
            placeholder="Write or paste your lyrics here...&#10;&#10;Verse 1:&#10;Walking down the moonlit road&#10;Carrying a heavy load..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[200px] text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue="pop">
              <SelectTrigger className="w-36 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Music Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="rnb">R&B</SelectItem>
                <SelectItem value="hiphop">Hip Hop</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="female">
              <SelectTrigger className="w-32 bg-secondary/50 border-border/50">
                <SelectValue placeholder="Voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="duet">Duet</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreate} disabled={generating} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2 ml-auto">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Creating..." : "Create Song"}
            </Button>
          </div>
        </div>

        {generating && (
          <div className="glass rounded-xl p-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Composing your song...</p>
          </div>
        )}

        {generated && !generating && (
          <div className="glass rounded-xl p-6 space-y-4">
            <div className="flex items-end justify-center gap-[2px] h-24">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="w-1 rounded-full gradient-primary" style={{ height: `${Math.random() * 80 + 20}%`, opacity: playing ? 1 : 0.5 }} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="glass h-10 w-10" onClick={() => setPlaying(!playing)}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <div className="flex-1 h-1 bg-secondary rounded-full"><div className="w-2/5 h-full gradient-primary rounded-full" /></div>
              <span className="text-xs text-muted-foreground">0:48 / 2:15</span>
              <Button variant="outline" size="sm" className="gap-1 border-border/50">
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
          </div>
        )}

        {!generating && !generated && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Music2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Write lyrics and choose a style to create a full song</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Song Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">Suno AI</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">320kbps</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Max Length</span><span className="text-foreground">4 min</span></div>
        </div>
      </aside>
    </div>
  );
}
