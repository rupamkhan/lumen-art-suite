import { useState } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StockResult {
  id: number;
  type: string;
  thumbnail: string;
  url: string;
  photographer: string;
  width: number;
  height: number;
}

const filters = ["All", "Images", "Videos"];

export default function StockAssets() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StockResult[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const type = activeFilter === "Videos" ? "video" : "image";
      const { data, error } = await supabase.functions.invoke("search-stock", {
        body: { query, type, page: 1 },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResults(data?.results || []);
      if (!data?.results?.length) toast.info("No results found. Try a different search term.");
    } catch (err: any) {
      toast.error(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search stock footage, images, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-12 pr-4 h-12 text-base bg-secondary/50 border-border/50 rounded-xl glass"
          />
        </div>
      </div>

      <div className="flex justify-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeFilter === f
                ? "gradient-primary text-primary-foreground glow-blue"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-48 rounded-xl bg-secondary animate-pulse-glow break-inside-avoid" />
          ))}
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {results.map((asset) => (
            <div
              key={asset.id}
              className="w-full rounded-xl relative group overflow-hidden cursor-pointer break-inside-avoid border border-border/50"
            >
              <img
                src={asset.thumbnail}
                alt={`Stock ${asset.type}`}
                className="w-full object-cover rounded-xl"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <span className="text-xs font-medium bg-secondary/80 px-2 py-0.5 rounded text-foreground">
                  {asset.photographer}
                </span>
                <a href={asset.url} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="ghost" className="h-8 w-8 glass text-foreground">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl glass flex items-center justify-center mb-4 opacity-50">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Search for stock images and videos from Pexels</p>
        </div>
      )}
    </div>
  );
}
