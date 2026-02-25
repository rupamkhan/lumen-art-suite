import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const presets = [
  { name: "Cinematic", colors: ["#1a1a2e", "#e94560"] },
  { name: "Vintage", colors: ["#d4a574", "#8b6f47"] },
  { name: "Teal & Orange", colors: ["#008080", "#ff8c00"] },
  { name: "Moody", colors: ["#2d1b69", "#11998e"] },
];

export default function VideoStudio() {
  const [playing, setPlaying] = useState(false);
  const [timeline, setTimeline] = useState([30]);
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);
  const [saturation, setSaturation] = useState([50]);
  const [temperature, setTemperature] = useState([50]);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Main Workspace */}
      <div className="flex-1 p-6 space-y-4 overflow-auto">
        {/* Video Player */}
        <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted" />
          <Button
            size="icon"
            variant="ghost"
            className="relative z-10 h-16 w-16 rounded-full glass glow-blue"
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Slider value={timeline} onValueChange={setTimeline} max={100} className="w-full" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <SkipBack className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setPlaying(!playing)}>
                {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <SkipForward className="h-3 w-3" />
              </Button>
            </div>
            <span>00:{String(Math.floor(timeline[0] * 0.6)).padStart(2, "0")} / 01:00</span>
          </div>
        </div>

        {/* Color Grading Presets */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">AI Color Grading</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setActivePreset(preset.name)}
                className={`glass rounded-xl p-3 text-left transition-all hover:scale-[1.03] ${
                  activePreset === preset.name ? "ring-1 ring-primary glow-blue" : ""
                }`}
              >
                <div className="flex gap-1 mb-2">
                  {preset.colors.map((c) => (
                    <div
                      key={c}
                      className="h-6 w-6 rounded-md"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-6 glass">
        <h3 className="text-sm font-semibold text-foreground">Adjustments</h3>
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
            <Slider value={ctrl.value} onValueChange={ctrl.set} max={100} />
          </div>
        ))}
      </aside>
    </div>
  );
}
