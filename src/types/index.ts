export type MessageRole = 'user' | 'assistant';

export type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  revisedPrompt?: string;
  createdAt: number;
};

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  images?: GeneratedImage[];
  isGenerating?: boolean;
  error?: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

export type ImageSize =
  | '1024x1024'
  | '1792x1024'
  | '1024x1792';

export type ImageQuality = 'standard' | 'hd';

export type ImageStyle = 'vivid' | 'natural';

export type GenerateImageRequest = {
  prompt: string;
  n?: number;
  size?: ImageSize;
  quality?: ImageQuality;
  style?: ImageStyle;
};

export type GenerateImageResponse = {
  images: GeneratedImage[];
  revisedPrompt?: string;
};

export type ChatRequest = {
  messages: Array<{ role: MessageRole; content: string }>;
  conversationId: string;
};

export type ChatResponse = {
  content: string;
  images?: GeneratedImage[];
};
