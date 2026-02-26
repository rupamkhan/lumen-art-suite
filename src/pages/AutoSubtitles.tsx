import { useState } from "react";
import { Upload, Download, Loader2, Subtitles, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockSubtitles = [
  { id: 1, start: "00:00:01", end: "00:00:04", text: "Welcome to OmniCraft AI, your creative studio." },
  { id: 2, start: "00:00:04", end: "00:00:08", text: "Today we'll explore the power of AI-driven content creation." },
  { id: 3, start: "00:00:08", end: "00:00:12", text: "From image generation to video editing and beyond." },
  { id: 4, start: "00:00:12", end: "00:00:16", text: "Let's dive in and see what's possible." },
  { id: 5, start: "00:00:16", end: "00:00:20", text: "Start by choosing a tool from the sidebar." },
];

export default function AutoSubtitles() {
  const [hasFile, setHasFile] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState(mockSubtitles);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHasFile(true);
    setProcessed(false);
    toast.success("Video loaded!");
  };

  const handleGenerate = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      toast.success("Subtitles generated!");
    }, 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {!hasFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => setHasFile(true)}
            className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center py-24 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="h-16 w-16 rounded-2xl glass flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Drop your video here</p>
            <p className="text-sm text-muted-foreground mt-1">MP4, MOV, AVI up to 500MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="aspect-video bg-gradient-to-br from-secondary to-muted rounded-xl flex items-center justify-center relative">
              <Button size="icon" variant="ghost" className="h-14 w-14 rounded-full glass glow-blue" onClick={() => setPlaying(!playing)}>
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              {processed && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-1.5 rounded-lg">
                  <p className="text-sm text-foreground">Welcome to OmniCraft AI, your creative studio.</p>
                </div>
              )}
            </div>

            {/* Timeline placeholder */}
            <div className="glass rounded-lg p-3">
              <div className="h-8 bg-secondary rounded flex items-center px-2 gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1 h-4 rounded-sm gradient-primary opacity-30" />
                ))}
              </div>
            </div>

            {!processed && (
              <Button onClick={handleGenerate} disabled={processing} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Subtitles className="h-4 w-4" />}
                {processing ? "Generating Subtitles..." : "Generate Subtitles"}
              </Button>
            )}

            {/* Transcript */}
            {processed && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Transcript</h3>
                  <Button variant="outline" size="sm" className="gap-1 border-border/50">
                    <Download className="h-3 w-3" /> Export SRT
                  </Button>
                </div>
                <div className="space-y-1">
                  {subtitles.map((sub) => (
                    <div key={sub.id} className="glass rounded-lg p-3 flex gap-3 items-start group hover:border-primary/50 transition-colors">
                      <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap pt-0.5">{sub.start}</span>
                      <input
                        className="flex-1 bg-transparent text-sm text-foreground outline-none"
                        defaultValue={sub.text}
                        onChange={(e) => {
                          setSubtitles((prev) => prev.map((s) => s.id === sub.id ? { ...s, text: e.target.value } : s));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Subtitle Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-foreground">Whisper (Groq)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Language</span><span className="text-foreground">Auto Detect</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="text-foreground">SRT</span></div>
        </div>
      </aside>
    </div>
  );
}
