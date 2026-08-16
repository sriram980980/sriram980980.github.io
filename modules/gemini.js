const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent'

export function createClient(getTokenFn) {
  const contents = []

  async function chat(userMessage, systemPrompt) {
    const token = getTokenFn()
    if (!token) throw new Error('Not signed in. Click Sign In.')

    contents.push({ role: 'user', parts: [{ text: userMessage }] })

    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? `Gemini API error ${res.status}`)
    }

    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    if (!reply) throw new Error('Empty response from Gemini.')

    contents.push({ role: 'model', parts: [{ text: reply }] })
    return reply
  }

  function resetHistory() {
    contents.length = 0
  }

  return { chat, resetHistory }
}
