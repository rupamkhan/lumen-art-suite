import { useState } from "react";
import { Search, Play, Pause, Download, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockSfx = [
  { id: 1, name: "Whoosh Transition", duration: "0:02", category: "Transition" },
  { id: 2, name: "UI Click", duration: "0:01", category: "Interface" },
  { id: 3, name: "Cinematic Boom", duration: "0:03", category: "Impact" },
  { id: 4, name: "Notification Chime", duration: "0:01", category: "Alert" },
  { id: 5, name: "Thunder Rumble", duration: "0:04", category: "Nature" },
  { id: 6, name: "Laser Beam", duration: "0:02", category: "Sci-Fi" },
  { id: 7, name: "Glass Break", duration: "0:02", category: "Impact" },
  { id: 8, name: "Rain Ambience", duration: "0:10", category: "Nature" },
  { id: 9, name: "Keyboard Typing", duration: "0:03", category: "Interface" },
  { id: 10, name: "Door Slam", duration: "0:01", category: "Foley" },
];

export default function SfxSearch() {
  const [query, setQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);

  const filtered = query ? mockSfx.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase())) : mockSfx;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sound effects... e.g., 'whoosh', 'click', 'explosion'"
            className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Results */}
        <div className="space-y-2">
          {filtered.map((sfx) => (
            <div key={sfx.id} className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-primary/50 transition-colors">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 shrink-0 glass"
                onClick={() => setPlayingId(playingId === sfx.id ? null : sfx.id)}
              >
                {playingId === sfx.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{sfx.name}</p>
                <p className="text-xs text-muted-foreground">{sfx.category} · {sfx.duration}</p>
              </div>

              {/* Mini waveform */}
              <div className="hidden sm:flex items-end gap-[1px] h-8 flex-1 max-w-[200px]">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-0.5 rounded-full ${playingId === sfx.id ? "gradient-primary" : "bg-muted-foreground/30"}`}
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
              </div>

              <Button variant="outline" size="sm" className="gap-1 border-border/50 shrink-0">
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Volume2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No sound effects found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
