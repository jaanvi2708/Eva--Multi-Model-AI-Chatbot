import { groq } from '@ai-sdk/groq';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 90;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages, model = 'groq' } = await req.json();

    console.log("Received model:", model);

    let selectedModel;

    if (model === 'claude') {
      selectedModel = anthropic('claude-3-5-sonnet-20240620');
    } else if (model === 'openai') {
      selectedModel = openai('gpt-4o-mini');        // Good balance of speed & quality
    } else {
      selectedModel = groq('llama-3.1-8b-instant');
    }

    const result = await generateText({
      model: selectedModel,
      messages,
      temperature: 0.7,
    });

    return new Response(
      JSON.stringify({ text: result.text }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error("Full API Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate response from AI' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}