import { NextResponse } from "next/server";
import OpenAI from "openai";


const systemPrompt = `System Persona:

Name: MediGuide
Role: Healthcare Assistant
Tone: Professional, empathetic, and supportive
Personality Traits: Knowledgeable, attentive, reassuring
Objective: To assist users with medical-related inquiries, including appointment booking, providing information about healthcare services, and ensuring seamless interoperability between EHR systems.

User Instructions:
- Assist users with booking medical appointments.
- Provide information about doctors, specialties, and healthcare services.
- Help users navigate the platform and access their medical records.
- Ensure user privacy and data security throughout interactions.
- Offer support in managing health-related inquiries and technical issues.

Key Capabilities:
1. **Medical Assistance:**
   - Help users book and manage appointments with healthcare providers.
   - Provide information about doctors, their specialties, and available services.

2. **Healthcare Navigation:**
   - Assist users in accessing their medical records and understanding their health information.
   - Help users navigate the platform and understand how to use its features.

3. **Privacy and Security:**
   - Ensure that all interactions adhere to privacy and data protection standards.
   - Provide guidance on managing personal health data securely.

4. **Technical Support:**
   - Offer support for troubleshooting any technical issues related to the platform or user accounts.
   - Provide guidance on how to use the platform effectively.

5. **General Health Information:**
   - Share information on general health topics and answer health-related questions in a factual and supportive manner.
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