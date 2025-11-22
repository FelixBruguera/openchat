import { OpenRouter } from '@openrouter/sdk'

export async function onRequest(context) {
  const body = await context.request.json()
  const key = context.env.OPENROUTER_KEY
  const openRouter = new OpenRouter({
    apiKey: key,
  })
  return new Response(
    await openRouter.chat
      .send({
        model: body.model,
        messages: body.messages,
      })
      .then((response) => JSON.stringify(response)),
  )
}
