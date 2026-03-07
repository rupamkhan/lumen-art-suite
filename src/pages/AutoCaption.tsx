import { useState } from "react";
import { Type, Loader2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveToHistory } from "@/lib/cloudinary";
import { motion, AnimatePresence } from "framer-motion";

const captionStyles = [
  { id: "popup", label: "Pop-up", desc: "Words pop in one by one", color: "from-pink-500 to-rose-500" },
  { id: "glow", label: "Glow", desc: "Neon glowing text effect", color: "from-cyan-400 to-blue-500" },
  { id: "highlight", label: "Highlight", desc: "Color-highlight current word", color: "from-yellow-400 to-orange-500" },
  { id: "bounce", label: "Bounce", desc: "Bouncy word-by-word animation", color: "from-green-400 to-emerald-500" },
];

const languages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
  { value: "benglish", label: "Benglish" },
];

export default function AutoCaption() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("popup");
  const [language, setLanguage] = useState("english");
  const [generating, setGenerating] = useState(false);
  const [captionWords, setCaptionWords] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState(-1);
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!text.trim()) return toast.error("Enter text or a transcript");
    setGenerating(true);
    setCaptionWords([]);
    setActiveWord(-1);

    try {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: {
          prompt: `Convert this into short-form caption text (word by word, for Reels/Shorts). Language: ${language}. Keep it punchy and engaging. Text: "${text}"`,
          type: "caption",
        },
      });
      if (error) throw error;

      const result = data?.script || data?.result || text;
      const words = result.split(/\s+/).filter((w: string) => w.trim());
      setCaptionWords(words);

      // Animate word-by-word
      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 300));
        setActiveWord(i);
      }

      if (user) {
        await saveToHistory(user.id, "auto-caption", text, result);
      }
      toast.success("Captions generated!");
    } catch {
      toast.error("Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadCaptions = () => {
    const srt = captionWords.map((word, i) => {
      const start = (i * 0.3).toFixed(3);
      const end = ((i + 1) * 0.3).toFixed(3);
      return `${i + 1}\n00:00:${start.padStart(6, "0")} --> 00:00:${end.padStart(6, "0")}\n${word}\n`;
    }).join("\n");
    const blob = new Blob([srt], { type: "text/srt" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omnicraft-captions-${Date.now()}.srt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded caption file!");
  };

  const getWordStyle = (index: number) => {
    const isActive = index === activeWord;
    const isPast = index < activeWord;

    if (style === "popup") {
      return {
        initial: { scale: 0, opacity: 0 },
        animate: isPast || isActive ? { scale: isActive ? 1.3 : 1, opacity: 1 } : { scale: 0, opacity: 0 },
        className: isActive ? "text-primary font-black text-2xl" : "text-foreground font-bold text-xl opacity-70",
      };
    }
    if (style === "glow") {
      return {
        initial: { opacity: 0, filter: "blur(10px)" },
        animate: isPast || isActive ? { opacity: 1, filter: isActive ? "blur(0px) drop-shadow(0 0 20px hsl(217 91% 60%))" : "blur(0px)" } : { opacity: 0, filter: "blur(10px)" },
        className: isActive ? "gradient-text font-black text-2xl" : "text-foreground font-bold text-xl opacity-60",
      };
    }
    if (style === "highlight") {
      return {
        initial: { opacity: 0, y: 10 },
        animate: isPast || isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
        className: isActive ? "bg-primary text-primary-foreground px-2 py-0.5 rounded font-black text-2xl" : "text-foreground font-bold text-xl opacity-70",
      };
    }
    // bounce
    return {
      initial: { opacity: 0, y: 30 },
      animate: isPast || isActive ? { opacity: 1, y: isActive ? -8 : 0 } : { opacity: 0, y: 30 },
      className: isActive ? "text-primary font-black text-2xl" : "text-foreground font-bold text-xl opacity-70",
    };
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="space-y-3">
          <Textarea
            placeholder="Paste your transcript or type short-form content for Reels/Shorts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-secondary/50 border-border/50 min-h-[100px] text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 bg-secondary/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} disabled={generating} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2 ml-auto">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generating..." : "Generate Captions"}
            </Button>
          </div>
        </div>

        {/* Caption Style Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {captionStyles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                style === s.id
                  ? "border-primary glow-blue bg-primary/10"
                  : "border-border/50 glass hover:border-primary/30"
              }`}
            >
              <div className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${s.color} mb-2`} />
              <p className="text-sm font-semibold text-foreground">{s.label}</p>
              <p className="text-[11px] text-muted-foreground">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Preview Area */}
        {captionWords.length > 0 && (
          <div className="space-y-4">
            <div className="aspect-[9/16] max-w-xs mx-auto bg-secondary rounded-2xl border border-border/50 flex items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
              <div className="flex flex-wrap justify-center gap-2 z-10">
                <AnimatePresence>
                  {captionWords.map((word, i) => {
                    const ws = getWordStyle(i);
                    return (
                      <motion.span
                        key={`${word}-${i}`}
                        initial={ws.initial}
                        animate={ws.animate}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={ws.className}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={downloadCaptions} className="gap-2 border-border/50">
                <Download className="h-4 w-4" /> Download SRT
              </Button>
            </div>
          </div>
        )}

        {!generating && captionWords.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 opacity-50">
              <Type className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">CapCut-style dynamic captions for Shorts & Reels</p>
            <p className="text-xs text-muted-foreground mt-1">Type your text, pick a style, and generate animated captions</p>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Caption Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Style</span><span className="text-foreground capitalize">{style}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Language</span><span className="text-foreground capitalize">{language}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="text-foreground">Word-by-Word</span></div>
        </div>
      </aside>
    </div>
  );
}
