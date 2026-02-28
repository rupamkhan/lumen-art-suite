import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import Dashboard from "./pages/Index";
import ImageStudio from "./pages/ImageStudio";
import VideoStudio from "./pages/VideoStudio";
import AudioStudio from "./pages/AudioStudio";
import StockAssets from "./pages/StockAssets";
import BackgroundRemover from "./pages/BackgroundRemover";
import ImageUpscaler from "./pages/ImageUpscaler";
import FaceSwap from "./pages/FaceSwap";
import VideoGenerator from "./pages/VideoGenerator";
import MusicGenerator from "./pages/MusicGenerator";
import SongCreator from "./pages/SongCreator";
import AutoSubtitles from "./pages/AutoSubtitles";
import SfxSearch from "./pages/SfxSearch";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/image-studio" element={<ImageStudio />} />
              <Route path="/video-studio" element={<VideoStudio />} />
              <Route path="/audio-studio" element={<AudioStudio />} />
              <Route path="/stock-assets" element={<StockAssets />} />
              <Route path="/bg-remover" element={<BackgroundRemover />} />
              <Route path="/image-upscaler" element={<ImageUpscaler />} />
              <Route path="/face-swap" element={<FaceSwap />} />
              <Route path="/video-generator" element={<VideoGenerator />} />
              <Route path="/music-generator" element={<MusicGenerator />} />
              <Route path="/song-creator" element={<SongCreator />} />
              <Route path="/auto-subtitles" element={<AutoSubtitles />} />
              <Route path="/sfx-search" element={<SfxSearch />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
