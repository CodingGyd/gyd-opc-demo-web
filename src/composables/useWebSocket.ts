import { ref, onUnmounted } from 'vue'
import { WebSocketManager, type WebSocketMessageHandler } from '@/api/websocket'

/**
 * Composable for managing a WebSocket connection.
 * Automatically disconnects when the component is unmounted.
 */
export function useWebSocket(url: string) {
  const manager = new WebSocketManager({ url })
  const isConnected = ref(false)
  const lastMessage = ref<any>(null)

  manager.on('_open', () => {
    isConnected.value = true
  })

  manager.on('_close', () => {
    isConnected.value = false
  })

  manager.on('_message', (data: any) => {
    lastMessage.value = data
  })

  function connect() {
    manager.connect()
  }

  function send(type: string, data: any) {
    manager.send(type, data)
  }

  function on(event: string, handler: WebSocketMessageHandler) {
    manager.on(event, handler)
  }

  function off(event: string, handler: WebSocketMessageHandler) {
    manager.off(event, handler)
  }

  function disconnect() {
    manager.disconnect()
  }

  // Auto-disconnect on component unmount
  onUnmounted(() => {
    manager.disconnect()
  })

  return {
    isConnected,
    lastMessage,
    connect,
    send,
    on,
    off,
    disconnect,
  }
}
