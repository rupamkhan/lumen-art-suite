import { useState, useRef } from "react";
import { Music, Sparkles, Loader2, Download, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveToHistory } from "@/lib/cloudinary";

export default function MusicGenerator() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("lofi");
  const [mood, setMood] = useState("chill");
  const [generating, setGenerating] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please describe the music you want");
    setGenerating(true);
    setAudioSrc(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-music", {
        body: { prompt, genre, mood },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAudioSrc(data.audio);
      toast.success("Music generated!");

      if (user) {
        await saveToHistory(user.id, "music-generator", `${prompt} (${genre}, ${mood})`, data.audio);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Music generation failed. Please try again.", {
        description: "The MusicGen model may be loading. Wait 30s and retry.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const downloadAudio = () => {
    if (!audioSrc) return;
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = `omnicraft-music-${Date.now()}.wav`;
    link.click();
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
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="w-36 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lofi">Lo-fi</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="w-32 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="chill">Chill</SelectItem>
                <SelectItem value="energetic">Energetic</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="happy">Happy</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
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
            <p className="text-sm text-muted-foreground">Composing your music... this may take up to 60s</p>
          </div>
        )}

        {audioSrc && !generating && (
          <div className="glass rounded-xl p-6 space-y-4">
            <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)} />
            <div className="flex items-end justify-center gap-[2px] h-24">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="w-1 rounded-full gradient-primary transition-opacity" style={{ height: `${Math.sin(i * 0.2) * 40 + 50}%`, opacity: playing ? 1 : 0.5 }} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="glass h-10 w-10" onClick={togglePlay}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <div className="flex-1 h-1 bg-secondary rounded-full"><div className="w-1/3 h-full gradient-primary rounded-full" /></div>
              <Button variant="outline" size="sm" onClick={downloadAudio} className="gap-1 border-border/50">
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
          </div>
        )}

        {!generating && !audioSrc && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Describe your music and click Generate</p>
            <p className="text-xs text-muted-foreground mt-1">Powered by Facebook MusicGen</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Music Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">MusicGen Small</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">32kHz WAV</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground">~8 sec</span></div>
        </div>
      </aside>
    </div>
  );
}
