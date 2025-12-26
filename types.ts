export interface SocialPost {
  headline: string;
  body: string;
  cta: string;
  hashtags: string[];
  imageUrl?: string;
  imageError?: string; // New field to capture why an image might be missing
}

export interface GenerateState {
  isLoading: boolean;
  error: string | null;
  result: SocialPost | null;
  statusMessage?: string;
}
