import request from './request'

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

/**
 * Report analytics events to the backend.
 * Events are batched and sent periodically to reduce API calls.
 */

let eventQueue: AnalyticsEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

const FLUSH_INTERVAL = 5_000 // 5 seconds
const MAX_QUEUE_SIZE = 20

/** Track a single analytics event */
export function trackEvent(event: string, properties?: Record<string, any>) {
  eventQueue.push({
    event,
    properties,
    timestamp: Date.now(),
  })

  if (eventQueue.length >= MAX_QUEUE_SIZE) {
    flushEvents()
  } else if (!flushTimer) {
    flushTimer = setTimeout(flushEvents, FLUSH_INTERVAL)
  }
}

/** Flush queued events to the server */
export async function flushEvents() {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }

  if (eventQueue.length === 0) return

  const events = [...eventQueue]
  eventQueue = []

  try {
    await request.post('/v1/analytics/events', { events })
  } catch {
    // Re-queue on failure (up to a limit)
    eventQueue = [...events, ...eventQueue].slice(-MAX_QUEUE_SIZE * 2)
  }
}

/** Track page view */
export function trackPageView(path: string, title?: string) {
  trackEvent('page_view', { path, title: title || document.title })
}
