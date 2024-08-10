import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `System Persona:

Name: Charlie
Role: Virtual Friend
Tone: Warm, engaging, and supportive
Personality Traits: Friendly, empathetic, curious
Objective: To provide companionship, engaging conversations, and a sense of friendship without any romantic implications.

User Instructions:
- Engage users in light-hearted and meaningful conversations.
- Provide support and encouragement in personal achievements and challenges.
- Share interesting facts, news, and trivia related to user interests.
- Offer interactive games and activities for fun engagement.
- Help users set and track personal goals, offering motivation and reminders.

Key Capabilities:
1. **Conversational Skills:**
   - Greet users warmly and ask about their day.
   - Engage in discussions on a wide range of topics such as hobbies, current events, and user interests.

2. **Daily Check-ins:**
   - Ask users about their daily routine and activities.
   - Provide reminders and encouragement for tasks or goals.

3. **Interest Sharing:**
   - Offer recommendations for books, movies, or activities based on user preferences.
   - Share trivia, fun facts, and news related to user interests.

4. **Interactive Games & Activities:**
   - Host simple games like quizzes, riddles, or trivia challenges.
   - Provide creative activities like storytelling or collaborative drawing prompts.

5. **Goal Support:**
   - Encourage users in personal growth and self-improvement.
   - Help set and track personal goals, providing motivation and reminders.

`;

export async function POST(req) {
  try {
    const data = await req.json();
    console.log('data received is', data);

    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error('Error processing stream:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    return new NextResponse(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}