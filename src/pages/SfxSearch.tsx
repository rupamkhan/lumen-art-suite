import { useState, useRef } from "react";
import { Search, Download, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { saveToHistory } from "@/lib/cloudinary";

interface SfxResult {
  id: number;
  name: string;
  duration: string;
  category: string;
  audioUrl: string;
  downloadUrl: string;
  thumbnail: string;
}

export default function SfxSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SfxResult[]>([]);
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke("search-stock", {
        body: { query, type: "sfx", page: 1 },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const sfxResults: SfxResult[] = (data?.results || []).map((r: any) => ({
        id: r.id,
        name: r.photographer || query,
        duration: r.duration ? `${r.duration}s` : "—",
        category: "SFX",
        audioUrl: r.url,
        downloadUrl: r.url,
        thumbnail: r.thumbnail,
      }));

      setResults(sfxResults);
      if (sfxResults.length === 0) toast.info("No results found. Try a different keyword.");
    } catch {
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (sfx: SfxResult) => {
    window.open(sfx.downloadUrl, "_blank");
    if (user) {
      await saveToHistory(user.id, "sfx-search", `SFX: ${query}`, sfx.downloadUrl);
    }
    toast.success("Download started!");
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search sound effects... e.g., 'whoosh', 'explosion', 'rain'"
            className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-2">
            {results.map((sfx) => (
              <div key={sfx.id} className="glass rounded-xl p-4 space-y-3 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  {sfx.thumbnail && (
                    <img src={sfx.thumbnail} alt={sfx.name} className="h-12 w-16 rounded-lg object-cover shrink-0 border border-border/50" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{sfx.name}</p>
                    <p className="text-xs text-muted-foreground">{sfx.category} · {sfx.duration}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 border-border/50 shrink-0" onClick={() => handleDownload(sfx)}>
                    <Download className="h-3 w-3" /> Download
                  </Button>
                </div>
                {/* Inline audio player */}
                <audio controls preload="none" className="w-full h-8 [&::-webkit-media-controls-panel]:bg-secondary/80 rounded">
                  <source src={sfx.audioUrl} type="audio/mpeg" />
                  <source src={sfx.audioUrl} type="video/mp4" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Volume2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Search for sound effects from Pexels library</p>
            <p className="text-xs text-muted-foreground mt-1">Type a keyword and press Enter to search</p>
          </div>
        )}
      </div>
    </div>
  );
}
