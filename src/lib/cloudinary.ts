import { supabase } from "@/integrations/supabase/client";

export async function uploadToCloudinary(
  base64Data: string,
  folder: string = "omnicraft",
  resourceType: string = "image"
): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("upload-cloudinary", {
      body: { base64Data, folder, resourceType },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data?.url || null;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return null;
  }
}

export async function saveToHistory(
  userId: string,
  toolName: string,
  prompt: string | null,
  resultUrl: string | null,
  resultText: string | null = null
) {
  try {
    await supabase.from("user_history").insert({
      user_id: userId,
      tool_name: toolName,
      prompt,
      result_url: resultUrl,
      result_text: resultText,
    });
  } catch (err) {
    console.error("Failed to save history:", err);
  }
}

export async function saveToMediaLibrary(
  userId: string,
  title: string,
  mediaType: string,
  url: string,
  prompt: string | null,
  toolUsed: string
) {
  try {
    await supabase.from("media_library").insert({
      user_id: userId,
      title,
      media_type: mediaType,
      url,
      prompt,
      tool_used: toolUsed,
    });
  } catch (err) {
    console.error("Failed to save to media library:", err);
  }
}
