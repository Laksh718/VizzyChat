import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import type { GeneratedImage, ImageSize } from '@/types';

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are VizzyChat, a creative AI assistant specialized in visual content generation.
Your role is to:
1. Understand the user's creative vision from natural language
2. Decide how many images to generate (1-4 based on context)
3. Craft optimized image generation prompts that achieve their vision
4. Respond with rich, vivid descriptions and never mention any underlying AI models or APIs to the user

When the user asks for images, artwork, visuals, designs, or anything visual:
- Generate 1 image for focused requests
- Generate 2-4 images when they want variations, multiple scenes, or explicitly ask for more
- Enhance their prompt with artistic style, lighting, mood, and composition details

Respond in JSON format exactly like this:
{
  "message": "Your friendly response text to the user",
  "shouldGenerateImages": true or false,
  "imageCount": 1-4,
  "imagePrompts": ["prompt 1", "prompt 2", ...],
  "imageSize": "1024x1024" | "1792x1024" | "1024x1792",
  "imageStyle": "vivid" | "natural",
  "imageQuality": "standard" | "hd"
}

For portrait/tall images: 1024x1792
For wide/landscape: 1792x1024  
For square/general: 1024x1024

Use "hd" quality for detailed artworks, "standard" for quick previews.
Use "vivid" for bold, dramatic content; "natural" for realistic or subtle work.`;

// ─── Rate limiting (simple in-memory) ────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}


function sanitizePrompt(prompt: string): string {
  // Remove potential injection attempts; keep it to reasonable length
  return prompt.trim().slice(0, 1000).replace(/[<>]/g, '');
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'API not configured.' },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body: { messages: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { messages } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
  }

  // Validate message structure
  for (const msg of messages) {
    if (
      typeof msg.content !== 'string' ||
      !['user', 'assistant'].includes(msg.role)
    ) {
      return NextResponse.json(
        { error: 'Invalid message format.' },
        { status: 400 },
      );
    }
  }

  try {
    // Step 1: Chat completion to understand intent
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1024,
      temperature: 0.8,
    });

    const rawContent = completion.choices[0]?.message?.content ?? '{}';
    let parsed: {
      message?: string;
      shouldGenerateImages?: boolean;
      imageCount?: number;
      imagePrompts?: string[];
      imageSize?: ImageSize;
      imageStyle?: 'vivid' | 'natural';
      imageQuality?: 'standard' | 'hd';
    };

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return NextResponse.json(
        { content: rawContent, images: [] },
        { status: 200 },
      );
    }

    const responseText =
      parsed.message ?? "Here's what I created for you!";

    // Step 2: Generate images if requested
    let generatedImages: GeneratedImage[] = [];

    if (parsed.shouldGenerateImages && parsed.imagePrompts?.length) {
      const count = Math.min(parsed.imageCount ?? 1, 4);
      const prompts = parsed.imagePrompts.slice(0, count);
      const size: ImageSize = parsed.imageSize ?? '1024x1024';
      const quality = parsed.imageQuality ?? 'standard';
      const style = parsed.imageStyle ?? 'vivid';

      // Generate images in parallel (DALL·E 3 only supports n=1, so parallel requests)
      const imagePromises = prompts.map(async (prompt) => {
        const safePrompt = sanitizePrompt(prompt);
        const result = await openai.images.generate({
          model: 'dall-e-3',
          prompt: safePrompt,
          n: 1,
          size,
          quality,
          style,
        });

        const data = result.data?.[0];
        if (!data) throw new Error('No image data returned');
        return {
          id: uuidv4(),
          url: data.url ?? '',
          prompt: safePrompt,
          revisedPrompt: data.revised_prompt,
          createdAt: Date.now(),
        } satisfies GeneratedImage;
      });

      generatedImages = await Promise.all(imagePromises);
    }

    return NextResponse.json(
      { content: responseText, images: generatedImages },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error('[VizzyChat API Error]', err);

    if (err instanceof OpenAI.APIError) {
      if (err.status === 429) {
        return NextResponse.json(
          {
            content:
              "I'm being rate-limited by OpenAI right now. Please try again in a moment.",
            images: [],
          },
          { status: 200 },
        );
      }
      if (err.status === 400) {
        return NextResponse.json(
          {
            content:
              "I wasn't able to generate that image — the content may not be allowed. Try rephrasing your request.",
            images: [],
          },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      {
        content:
          'Something went wrong on my end. Please try again.',
        images: [],
      },
      { status: 200 },
    );
  }
}
