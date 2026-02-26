import { useState } from "react";
import { Upload, Download, Loader2, Eraser, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BackgroundRemover() {
  const [hasFile, setHasFile] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setHasFile(true);
    setProcessed(false);
    toast.success("Image loaded!");
  };

  const handleRemove = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      toast.success("Background removed successfully!");
    }, 2500);
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
            <p className="text-foreground font-medium">Drop your image here</p>
            <p className="text-sm text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Before/After Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Original</p>
                <div className="aspect-square bg-gradient-to-br from-secondary to-muted rounded-lg flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground/30" />
                </div>
              </div>
              <div className="glass rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Result</p>
                <div className="aspect-square rounded-lg flex items-center justify-center" style={{ backgroundImage: "repeating-conic-gradient(hsl(var(--secondary)) 0% 25%, transparent 0% 50%)", backgroundSize: "20px 20px" }}>
                  {processed ? (
                    <div className="w-full h-full bg-gradient-to-br from-secondary/80 to-muted/80 rounded-lg flex items-center justify-center">
                      <Image className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  ) : (
                    <Eraser className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleRemove} disabled={processing} className="flex-1 gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eraser className="h-4 w-4" />}
                {processing ? "Removing..." : "Remove Background"}
              </Button>
              <Button variant="outline" disabled={!processed} className="gap-2 border-border/50">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/50 p-5 space-y-4 glass">
        <h3 className="text-sm font-semibold text-foreground">Settings</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Output Format</span><span className="text-foreground">PNG</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Transparency</span><span className="text-foreground">Yes</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="text-foreground">High</span></div>
        </div>
      </aside>
    </div>
  );
}
