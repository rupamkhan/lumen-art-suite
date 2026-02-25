import { useState } from "react";
import { Upload, Mic, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function AudioStudio() {
  const [hasFile, setHasFile] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [speechEnhance, setSpeechEnhance] = useState(true);
  const [noiseReduction, setNoiseReduction] = useState([70]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHasFile(true);
    toast.success("Audio file loaded!");
  };

  const handleEnhance = () => {
    setEnhancing(true);
    setTimeout(() => {
      setEnhancing(false);
      setEnhanced(true);
      toast.success("Voice enhanced successfully!");
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {!hasFile ? (
          /* Drop Zone */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => setHasFile(true)}
            className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center py-24 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="h-16 w-16 rounded-2xl glass flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Drop your audio file here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
          </div>
        ) : (
          <>
            {/* Waveform Visualizer */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-end justify-center gap-[3px] h-32">
                {Array.from({ length: 60 }).map((_, i) => {
                  const h = Math.random() * 80 + 20;
                  return (
                    <div
                      key={i}
                      className="w-1.5 rounded-full gradient-primary animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 50}ms`,
                        animationDuration: `${1000 + Math.random() * 1000}ms`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="glass rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-neon-blue" />
                  <span className="text-foreground font-medium">Enhance Speech (AI)</span>
                </div>
                <Switch checked={speechEnhance} onCheckedChange={setSpeechEnhance} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Noise Reduction</span>
                  <span className="text-foreground font-medium">{noiseReduction[0]}%</span>
                </div>
                <Slider value={noiseReduction} onValueChange={setNoiseReduction} max={100} />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleEnhance}
                  disabled={enhancing}
                  className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2"
                >
                  {enhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                  {enhancing ? "Enhancing..." : "Enhance Audio"}
                </Button>
                <Button
                  variant="outline"
                  disabled={!enhanced}
                  className="gap-2 border-border/50"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Panel */}
      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Audio Properties</h3>
        <div className="space-y-2 text-sm">
          {hasFile ? (
            <>
              <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="text-foreground">WAV</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground">3:24</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sample Rate</span><span className="text-foreground">48kHz</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Channels</span><span className="text-foreground">Stereo</span></div>
            </>
          ) : (
            <p className="text-muted-foreground">Upload a file to see properties</p>
          )}
        </div>
      </aside>
    </div>
  );
}
