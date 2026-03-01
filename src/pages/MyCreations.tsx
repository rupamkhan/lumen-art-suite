import { useState, useEffect } from "react";
import { Download, Trash2, Clock, Image, FileText, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  tool_name: string;
  prompt: string | null;
  result_url: string | null;
  result_text: string | null;
  created_at: string;
}

export default function MyCreations() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast.error("Failed to load history");
      console.error(error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("user_history").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted");
    }
  };

  const filtered = items.filter(
    (i) =>
      (i.prompt || "").toLowerCase().includes(search.toLowerCase()) ||
      i.tool_name.toLowerCase().includes(search.toLowerCase())
  );

  const toolColor: Record<string, string> = {
    "image-generator": "from-neon-blue to-neon-purple",
    "script-writer": "from-emerald-500 to-teal-500",
    "stock-search": "from-amber-500 to-rose-500",
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center">
        <div className="space-y-3">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <p className="text-muted-foreground">Sign in to view your creation history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Creations</h1>
          <p className="text-muted-foreground text-sm mt-1">Your past AI-generated images, scripts, and searches.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
          <p className="text-muted-foreground">No creations yet. Start generating to see your history here!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="glass rounded-xl p-5 flex gap-5 items-start group hover:glow-blue transition-all">
              {/* Thumbnail or icon */}
              {item.result_url ? (
                <img
                  src={item.result_url}
                  alt="Result"
                  className="h-20 w-20 rounded-lg object-cover border border-border/50 shrink-0"
                />
              ) : (
                <div className={`h-20 w-20 rounded-lg bg-gradient-to-br ${toolColor[item.tool_name] || "from-secondary to-muted"} flex items-center justify-center shrink-0`}>
                  {item.result_text ? <FileText className="h-6 w-6 text-primary-foreground" /> : <Image className="h-6 w-6 text-primary-foreground" />}
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] capitalize">{item.tool_name.replace("-", " ")}</Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {item.prompt && (
                  <p className="text-sm text-foreground truncate">{item.prompt}</p>
                )}
                {item.result_text && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.result_text}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.result_url && (
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                    <a href={item.result_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
