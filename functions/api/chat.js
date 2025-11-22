import { OpenRouter } from '@openrouter/sdk'

export async function onRequest(context) {
  const body = await context.request.json()
  const key = context.env.OPENROUTER_KEY
  const openRouter = new OpenRouter({
    apiKey: key,
  })
  const encoder = new TextEncoder()
  const sdkStream = await openRouter.chat.send({
    model: body.model,
    messages: body.messages,
    stream: true,
    streamOptions: { includeUsage: true },
  })
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of sdkStream) {
          const content = `data: ${JSON.stringify(chunk)}\n\n`
          controller.enqueue(encoder.encode(content))
        }
        controller.close()
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
    },
  )
}
