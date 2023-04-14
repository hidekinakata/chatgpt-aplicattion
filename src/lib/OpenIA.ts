import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export const config = {
  runtime: "edge",
};

export interface Payload {
  botMood?: string;
  prompt: string;
}

export default async function OAIStream(payload: Payload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let counter = 0;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env["OPENAI_KEY"] ?? ""}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: payload.botMood
            ? payload.botMood
            : "don't be too succinct or too detailed in your answer.",
        },
        {
          role: "user",
          content: payload.prompt,
        },
      ],
      stream: true,
    }),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            console.log(json);
            const text = json.choices[0].delta.content;

            if (text === undefined || text === null) return;
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);

      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
