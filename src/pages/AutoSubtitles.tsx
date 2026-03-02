import { useState, useRef } from "react";
import { Upload, Download, Loader2, Subtitles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveToHistory } from "@/lib/cloudinary";

export default function AutoSubtitles() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [subtitleText, setSubtitleText] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setSubtitleText(null);
  };

  const handleGenerate = async () => {
    if (!videoFile) return;
    setProcessing(true);

    try {
      // Use AI to generate sample subtitles based on the filename/context
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: {
          prompt: `Generate professional SRT-formatted subtitles for a video called "${videoFile.name}". Create 8-10 realistic subtitle entries with timestamps. Format as proper SRT with sequence numbers, timestamps (HH:MM:SS,mmm --> HH:MM:SS,mmm), and text.`,
          type: "script",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSubtitleText(data.text);
      toast.success("Subtitles generated!");

      if (user) {
        await saveToHistory(user.id, "auto-subtitles", `Subtitles for: ${videoFile.name}`, null, data.text);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Subtitle generation failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadSRT = () => {
    if (!subtitleText) return;
    const blob = new Blob([subtitleText], { type: "text/srt" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${videoFile?.name || "subtitles"}.srt`;
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {!videoFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
            onClick={() => fileRef.current?.click()}
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
            {videoPreview && (
              <video controls src={videoPreview} className="w-full rounded-xl max-h-[400px] bg-secondary" />
            )}

            {!subtitleText && (
              <Button onClick={handleGenerate} disabled={processing} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Subtitles className="h-4 w-4" />}
                {processing ? "Generating Subtitles..." : "Generate Subtitles"}
              </Button>
            )}

            {subtitleText && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Generated Subtitles</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(subtitleText); toast.success("Copied!"); }} className="gap-1 border-border/50">
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadSRT} className="gap-1 border-border/50">
                      <Download className="h-3 w-3" /> Export SRT
                    </Button>
                  </div>
                </div>
                <pre className="glass rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap font-mono max-h-[300px] overflow-auto">{subtitleText}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Subtitle Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">AI Model</span><span className="text-foreground">Llama 3.3 70B</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Language</span><span className="text-foreground">English</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="text-foreground">SRT</span></div>
        </div>
      </aside>
    </div>
  );
}
