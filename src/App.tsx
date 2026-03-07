import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "./pages/Index";
import Dashboard from "./pages/Dashboard";
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
import AutoCaption from "./pages/AutoCaption";
import SfxSearch from "./pages/SfxSearch";
import Settings from "./pages/Settings";
import MyCreations from "./pages/MyCreations";
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
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/image-studio" element={<ProtectedRoute><ImageStudio /></ProtectedRoute>} />
              <Route path="/video-studio" element={<ProtectedRoute><VideoStudio /></ProtectedRoute>} />
              <Route path="/audio-studio" element={<ProtectedRoute><AudioStudio /></ProtectedRoute>} />
              <Route path="/stock-assets" element={<ProtectedRoute><StockAssets /></ProtectedRoute>} />
              <Route path="/bg-remover" element={<ProtectedRoute><BackgroundRemover /></ProtectedRoute>} />
              <Route path="/image-upscaler" element={<ProtectedRoute><ImageUpscaler /></ProtectedRoute>} />
              <Route path="/face-swap" element={<ProtectedRoute><FaceSwap /></ProtectedRoute>} />
              <Route path="/video-generator" element={<ProtectedRoute><VideoGenerator /></ProtectedRoute>} />
              <Route path="/music-generator" element={<ProtectedRoute><MusicGenerator /></ProtectedRoute>} />
              <Route path="/song-creator" element={<ProtectedRoute><SongCreator /></ProtectedRoute>} />
              <Route path="/auto-subtitles" element={<ProtectedRoute><AutoSubtitles /></ProtectedRoute>} />
              <Route path="/auto-caption" element={<ProtectedRoute><AutoCaption /></ProtectedRoute>} />
              <Route path="/sfx-search" element={<ProtectedRoute><SfxSearch /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/my-creations" element={<ProtectedRoute><MyCreations /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
