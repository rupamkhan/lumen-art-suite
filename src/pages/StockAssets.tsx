import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const filters = ["All", "Images", "Videos", "4K", "HD"];

const mockAssets = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  h: ["h-40", "h-56", "h-48", "h-64", "h-44", "h-52"][i % 6],
  type: i % 3 === 0 ? "Video" : "Image",
  res: i % 2 === 0 ? "4K" : "HD",
}));

export default function StockAssets() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Search Bar */}
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

      {/* Filter Chips */}
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

      {/* Grid */}
      {loading && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`w-full rounded-xl bg-secondary animate-pulse-glow break-inside-avoid ${mockAssets[i]?.h || "h-48"}`}
            />
          ))}
        </div>
      )}

      {searched && !loading && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {mockAssets.map((asset) => (
            <div
              key={asset.id}
              className={`${asset.h} w-full rounded-xl bg-gradient-to-br from-secondary to-muted relative group overflow-hidden cursor-pointer break-inside-avoid`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <span className="text-xs font-medium bg-secondary/80 px-2 py-0.5 rounded text-foreground">
                  {asset.res}
                </span>
                <Button size="icon" variant="ghost" className="h-8 w-8 glass text-foreground">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !searched && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl glass flex items-center justify-center mb-4 opacity-50">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Search for stock images and videos</p>
        </div>
      )}
    </div>
  );
}
