export interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}
type StylePreset =
  | "3d-model"
  | "analog-film"
  | "anime"
  | "cinematic"
  | "comic-book"
  | "digital-art"
  | "enhance"
  | "fantasy-art"
  | "isometric"
  | "line-art"
  | "low-poly"
  | "modeling-compound"
  | "neon-punk"
  | "origami"
  | "photographic"
  | "pixel-art"
  | "tile-texture";
