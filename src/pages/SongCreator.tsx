import { useState, useRef } from "react";
import { Music2, Sparkles, Loader2, Download, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveToHistory } from "@/lib/cloudinary";

export default function SongCreator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("pop");
  const [generating, setGenerating] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!prompt.trim()) return toast.error("Please describe your song");
    setGenerating(true);
    setAudioSrc(null);

    try {
      // Generate real audio using MusicGen via generate-music edge function
      const { data, error } = await supabase.functions.invoke("generate-music", {
        body: { prompt: `${prompt}, ${style} style, full song, vocals and instruments`, genre: style, mood: "energetic" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAudioSrc(data.audio);
      toast.success("Song created!");

      if (user) {
        await saveToHistory(user.id, "song-creator", prompt, data.audio);
      }
    } catch {
      toast.error("Song creation failed. The model may be loading — try again in 30s.");
    } finally {
      setGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause(); else audioRef.current.play();
    setPlaying(!playing);
  };

  const downloadAudio = () => {
    if (!audioSrc) return;
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = `omnicraft-song-${Date.now()}.wav`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Song Description</label>
          <Textarea
            placeholder="Describe your song...&#10;&#10;Example: An upbeat pop track with catchy synths and powerful vocals about summer freedom"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[200px] text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-36 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="rnb">R&B</SelectItem>
                <SelectItem value="hiphop">Hip Hop</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreate} disabled={generating} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2 ml-auto">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Creating Song..." : "Create Song"}
            </Button>
          </div>
        </div>

        {generating && (
          <div className="glass rounded-xl p-8 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Composing your song... this may take up to 60s</p>
          </div>
        )}

        {audioSrc && !generating && (
          <div className="glass rounded-xl p-6 space-y-4">
            {/* Native HTML5 audio player for real-time playback */}
            <audio
              ref={audioRef}
              controls
              src={audioSrc}
              onEnded={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="w-full"
            />
            <div className="flex items-end justify-center gap-[2px] h-24">
              {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="w-1 rounded-full gradient-primary transition-opacity" style={{ height: `${Math.sin(i * 0.2) * 40 + 50}%`, opacity: playing ? 1 : 0.5 }} />
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={downloadAudio} className="gap-1 border-border/50">
                <Download className="h-3 w-3" /> Export WAV
              </Button>
            </div>
          </div>
        )}

        {!generating && !audioSrc && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Music2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Describe your song to generate a real audio track</p>
            <p className="text-xs text-muted-foreground mt-1">Powered by Facebook MusicGen</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Song Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">AI Model</span><span className="text-foreground">MusicGen</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Output</span><span className="text-foreground">Audio WAV</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground">~8 sec</span></div>
        </div>
      </aside>
    </div>
  );
}
