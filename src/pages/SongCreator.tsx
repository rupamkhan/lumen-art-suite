import { useState } from "react";
import { Music2, Sparkles, Loader2, Download, Copy } from "lucide-react";
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
  const [voice, setVoice] = useState("female");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!prompt.trim()) return toast.error("Please describe your song or enter lyrics");
    setGenerating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: { prompt, type: "song", style, voice },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.text);
      toast.success("Song lyrics generated!");

      if (user) {
        await saveToHistory(user.id, "song-creator", prompt, null, data.text);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Song creation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Song Idea or Lyrics</label>
          <Textarea
            placeholder="Describe your song idea or paste existing lyrics to enhance...&#10;&#10;Example: A heartfelt ballad about finding love in a small town"
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
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
              </SelectContent>
            </Select>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="w-32 bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
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
            <p className="text-sm text-muted-foreground">Writing your song...</p>
          </div>
        )}

        {result && !generating && (
          <div className="glass rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Generated Lyrics</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1 border-border/50">
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
            </div>
            <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans">{result}</pre>
          </div>
        )}

        {!generating && !result && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Music2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Describe your song idea to generate lyrics</p>
            <p className="text-xs text-muted-foreground mt-1">Powered by Groq/Gemini AI</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Song Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">AI Model</span><span className="text-foreground">Llama 3.3 70B</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Output</span><span className="text-foreground">Full Lyrics</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Sections</span><span className="text-foreground">Verse/Chorus/Bridge</span></div>
        </div>
      </aside>
    </div>
  );
}
