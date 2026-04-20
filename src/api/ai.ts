const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Stream an AI chat response using Server-Sent Events via fetch.
 *
 * @param messages - Conversation history
 * @param onChunk - Called for each text chunk received
 * @param onDone - Called when the stream completes
 * @param onError - Called if an error occurs
 * @returns An abort controller to cancel the stream
 */
export function chatStream(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
): AbortController {
  const controller = new AbortController()

  const token = localStorage.getItem('token')

  fetch(`${BASE_URL}/v1/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-Product-Key': import.meta.env.VITE_PRODUCT_KEY || '',
    },
    body: JSON.stringify({ messages, stream: true }),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`AI chat request failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No readable stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Parse SSE lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') {
              onDone()
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                onChunk(parsed.content)
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }
      }

      onDone()
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        onError(err instanceof Error ? err : new Error(String(err)))
      }
    })

  return controller
}
