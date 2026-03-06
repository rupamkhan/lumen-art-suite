import { useState, useRef, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const presets = [
  { name: "Cinematic", filter: "saturate(1.2) contrast(1.15) sepia(0.15) brightness(0.95)" },
  { name: "Vintage", filter: "sepia(0.5) contrast(1.1) saturate(0.8) brightness(1.05)" },
  { name: "Teal & Orange", filter: "hue-rotate(-15deg) saturate(1.4) contrast(1.1)" },
  { name: "Moody", filter: "saturate(0.6) contrast(1.3) brightness(0.8)" },
];

export default function VideoStudio() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [timeline, setTimeline] = useState([0]);
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);
  const [saturation, setSaturation] = useState([50]);
  const [temperature, setTemperature] = useState([50]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setActivePreset(null);
    toast.success("Video loaded!");
  };

  const getFilterString = () => {
    if (activePreset) {
      return presets.find((p) => p.name === activePreset)?.filter || "none";
    }
    const b = brightness[0] / 50;
    const c = contrast[0] / 50;
    const s = saturation[0] / 50;
    const t = temperature[0] - 50;
    return `brightness(${b}) contrast(${c}) saturate(${s}) hue-rotate(${t * 0.5}deg)`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100;
    setTimeline([pct]);
  };

  const handleSeek = (val: number[]) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = (val[0] / 100) * videoRef.current.duration;
    setTimeline(val);
  };

  const applyPreset = (name: string) => {
    setActivePreset(name === activePreset ? null : name);
  };

  const exportFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = getFilterString();
    ctx.drawImage(video, 0, 0);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `color-graded-frame-${Date.now()}.png`;
    link.click();
    toast.success("Color-graded frame exported!");
  }, [activePreset, brightness, contrast, saturation, temperature]);

  return (
    <div className="flex flex-col lg:flex-row h-full animate-fade-in">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        {!videoSrc ? (
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
          <>
            <div className="aspect-video bg-secondary rounded-xl overflow-hidden relative">
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain"
                style={{ filter: getFilterString() }}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setPlaying(false)}
                onClick={togglePlay}
              />
              {!playing && (
                <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="h-16 w-16 rounded-full glass flex items-center justify-center glow-blue">
                    <Play className="h-7 w-7 ml-1 text-foreground" />
                  </div>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Slider value={timeline} onValueChange={handleSeek} max={100} className="w-full" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { if (videoRef.current) videoRef.current.currentTime = 0; }}><SkipBack className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={togglePlay}>
                    {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { if (videoRef.current) videoRef.current.currentTime = videoRef.current.duration; }}><SkipForward className="h-3 w-3" /></Button>
                </div>
                <Button variant="outline" size="sm" onClick={exportFrame} className="gap-1 border-border/50">
                  <Download className="h-3 w-3" /> Export Frame
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Color Grading Presets</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.name)}
                    className={`glass rounded-xl p-3 text-left transition-all hover:scale-[1.03] ${activePreset === preset.name ? "ring-1 ring-primary glow-blue" : ""}`}
                  >
                    <div className="h-8 w-full rounded-md bg-secondary mb-2" style={{ filter: preset.filter }} />
                    <span className="text-xs font-medium text-foreground">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-6 glass">
        <h3 className="text-sm font-semibold text-foreground">Manual Adjustments</h3>
        {[
          { label: "Brightness", value: brightness, set: setBrightness },
          { label: "Contrast", value: contrast, set: setContrast },
          { label: "Saturation", value: saturation, set: setSaturation },
          { label: "Temperature", value: temperature, set: setTemperature },
        ].map((ctrl) => (
          <div key={ctrl.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{ctrl.label}</span>
              <span className="text-foreground font-medium">{ctrl.value[0]}</span>
            </div>
            <Slider value={ctrl.value} onValueChange={(v) => { ctrl.set(v); setActivePreset(null); }} max={100} />
          </div>
        ))}
      </aside>
    </div>
  );
}
