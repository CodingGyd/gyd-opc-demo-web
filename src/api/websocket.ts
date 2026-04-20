export type WebSocketMessageHandler = (data: any) => void

export interface WebSocketOptions {
  url: string
  /** Auto-reconnect on disconnect (default: true) */
  autoReconnect?: boolean
  /** Max reconnect attempts (default: 5) */
  maxReconnectAttempts?: number
  /** Reconnect delay in ms (default: 3000) */
  reconnectDelay?: number
  /** Protocols for WebSocket */
  protocols?: string | string[]
}

/**
 * WebSocket manager with automatic reconnection.
 */
export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private listeners: Map<string, Set<WebSocketMessageHandler>> = new Map()
  private options: Required<Pick<WebSocketOptions, 'autoReconnect' | 'maxReconnectAttempts' | 'reconnectDelay'>> & {
    url: string
    protocols?: string | string[]
  }

  constructor(options: WebSocketOptions) {
    this.options = {
      url: options.url,
      autoReconnect: options.autoReconnect ?? true,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 5,
      reconnectDelay: options.reconnectDelay ?? 3000,
      protocols: options.protocols,
    }
  }

  /** Open the WebSocket connection */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    const token = localStorage.getItem('token')
    const url = token
      ? `${this.options.url}?token=${encodeURIComponent(token)}`
      : this.options.url

    this.ws = this.options.protocols
      ? new WebSocket(url, this.options.protocols)
      : new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.emit('_open', null)
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.emit(data.type || data.event || '_message', data)
      } catch {
        this.emit('_raw', event.data)
      }
    }

    this.ws.onclose = (event) => {
      this.emit('_close', { code: event.code, reason: event.reason })
      this.attemptReconnect()
    }

    this.ws.onerror = (error) => {
      this.emit('_error', error)
    }
  }

  /** Send a message through the WebSocket */
  send(type: string, data: any): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send — not connected')
      return
    }
    this.ws.send(JSON.stringify({ type, data }))
  }

  /** Register an event listener */
  on(event: string, handler: WebSocketMessageHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler)
  }

  /** Remove an event listener */
  off(event: string, handler: WebSocketMessageHandler): void {
    this.listeners.get(event)?.delete(handler)
  }

  /** Close the connection */
  disconnect(): void {
    this.options.autoReconnect = false
    this.ws?.close()
    this.ws = null
  }

  /** Get current connection state */
  get state(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((handler) => {
      try {
        handler(data)
      } catch (err) {
        console.error(`[WebSocket] Listener error for "${event}":`, err)
      }
    })
  }

  private attemptReconnect(): void {
    if (!this.options.autoReconnect) return
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.emit('_max_reconnect', null)
      return
    }

    this.reconnectAttempts++
    setTimeout(() => this.connect(), this.options.reconnectDelay)
  }
}
