<template>
  <div class="ai-chat">
    <div class="ai-chat__messages" ref="messagesContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="ai-chat__message"
        :class="`ai-chat__message--${msg.role}`"
      >
        <div class="ai-chat__bubble">
          <pre v-if="msg.role === 'assistant'" class="ai-chat__text">{{ msg.content }}</pre>
          <p v-else class="ai-chat__text">{{ msg.content }}</p>
        </div>
      </div>
      <div v-if="streaming" class="ai-chat__message ai-chat__message--assistant">
        <div class="ai-chat__bubble">
          <pre class="ai-chat__text ai-chat__text--streaming">{{ streamBuffer }}<span class="ai-chat__cursor">|</span></pre>
        </div>
      </div>
    </div>

    <div class="ai-chat__input-area">
      <textarea
        v-model="inputText"
        class="ai-chat__input"
        placeholder="Type a message..."
        rows="1"
        @keydown.enter.exact.prevent="sendMessage"
        :disabled="streaming"
      ></textarea>
      <button class="ai-chat__send-btn" @click="sendMessage" :disabled="!inputText.trim() || streaming">
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { chatStream, type ChatMessage } from '@/api/ai'

const props = withDefaults(defineProps<{
  /** System prompt to prepend */
  systemPrompt?: string
}>(), {
  systemPrompt: '',
})

const emit = defineEmits<{
  /** Emitted after each completed response */
  response: [content: string]
}>()

const messagesContainer = ref<HTMLElement | null>(null)
const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const streaming = ref(false)
const streamBuffer = ref('')

let abortController: AbortController | null = null

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || streaming.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  scrollToBottom()

  // Build the conversation context
  const context: ChatMessage[] = []
  if (props.systemPrompt) {
    context.push({ role: 'system', content: props.systemPrompt })
  }
  context.push(...messages.value)

  streaming.value = true
  streamBuffer.value = ''

  abortController = chatStream(
    context,
    // onChunk
    (chunk: string) => {
      streamBuffer.value += chunk
      scrollToBottom()
    },
    // onDone
    () => {
      streaming.value = false
      if (streamBuffer.value) {
        messages.value.push({ role: 'assistant', content: streamBuffer.value })
        emit('response', streamBuffer.value)
      }
      streamBuffer.value = ''
      abortController = null
      scrollToBottom()
    },
    // onError
    (err: Error) => {
      streaming.value = false
      streamBuffer.value = ''
      messages.value.push({
        role: 'assistant',
        content: `[Error] ${err.message}`,
      })
      abortController = null
      scrollToBottom()
    },
  )
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Cleanup on unmount
watch(streaming, (val, oldVal) => {
  if (oldVal && !val && abortController) {
    abortController.abort()
  }
})
</script>

<style scoped>
.ai-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface);
}

.ai-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.ai-chat__message {
  display: flex;
}

.ai-chat__message--user {
  justify-content: flex-end;
}

.ai-chat__message--assistant {
  justify-content: flex-start;
}

.ai-chat__bubble {
  max-width: 80%;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
}

.ai-chat__message--user .ai-chat__bubble {
  background: var(--color-primary);
  color: white;
  border-bottom-right-radius: var(--radius-xs);
}

.ai-chat__message--assistant .ai-chat__bubble {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: var(--radius-xs);
}

.ai-chat__text {
  font-size: var(--font-size-sm);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.ai-chat__cursor {
  animation: blink 0.8s step-end infinite;
  color: var(--color-text-secondary);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.ai-chat__input-area {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.ai-chat__input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: none;
  font-size: var(--font-size-sm);
  outline: none;
}

.ai-chat__input:focus {
  border-color: var(--color-primary);
}

.ai-chat__send-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  white-space: nowrap;
}

.ai-chat__send-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.ai-chat__send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
