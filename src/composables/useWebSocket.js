import { ref } from 'vue'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

/**
 * STOMP/SockJS 기반 WebSocket composable
 *
 * - 모듈 레벨 싱글톤 클라이언트 (앱 전체에서 하나의 연결 공유)
 * - 자동 재접속: 최대 3회 (이후 deactivate)
 * - subscribe(topic, callback): JSON.parse 시도 후 실패하면 raw body 전달
 *   같은 토픽 재구독 시 콜백만 갱신
 * - 연결 전에 subscribe 호출해도 onConnect 시점에 자동으로 구독됨
 *
 * 사용 예:
 *   const ws = useWebSocket()
 *   onMounted(() => {
 *     ws.connect()
 *     ws.subscribe(`/topic/sensor/${eqId}`, (msg) => { ... })
 *   })
 *   onUnmounted(() => {
 *     ws.unsubscribe(`/topic/sensor/${eqId}`)
 *   })
 */

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'
const RECONNECT_DELAY_MS = 3000
const MAX_RECONNECT_ATTEMPTS = 3

const isConnected = ref(false)
// topic -> { callback, sub }
const subscriptions = new Map()

let client = null
let reconnectAttempts = 0
let manualDeactivate = false

function bindSubscription(topic, entry) {
    entry.sub = client.subscribe(topic, (message) => {
        let payload = message.body
        try {
            payload = JSON.parse(message.body)
        } catch {
            // JSON 아니면 raw 그대로 전달
        }
        try {
            entry.callback(payload)
        } catch (err) {
            console.error(`[useWebSocket] subscribe callback error (${topic})`, err)
        }
    })
}

function ensureClient() {
    if (client) return client

    client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        reconnectDelay: RECONNECT_DELAY_MS,
        debug: () => {
            // 운영 시 노이즈 방지: 디버그 로그 비활성화
        },
        onConnect: () => {
            isConnected.value = true
            reconnectAttempts = 0
            // 재접속 가능 상태로 복원
            client.reconnectDelay = RECONNECT_DELAY_MS

            // 기존 구독 재바인딩
            subscriptions.forEach((entry, topic) => {
                bindSubscription(topic, entry)
            })
        },
        onWebSocketClose: () => {
            isConnected.value = false

            if (manualDeactivate) {
                return
            }

            reconnectAttempts += 1
            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                console.warn(
                    `[useWebSocket] 최대 재접속 횟수(${MAX_RECONNECT_ATTEMPTS}) 초과 — 연결 종료`,
                )
                client.reconnectDelay = 0
                client.deactivate()
            }
        },
        onStompError: (frame) => {
            console.error(
                '[useWebSocket] STOMP error:',
                frame.headers && frame.headers.message,
                frame.body,
            )
        },
    })

    return client
}

export function useWebSocket() {
    function connect() {
        const c = ensureClient()
        if (!c.active) {
            manualDeactivate = false
            reconnectAttempts = 0
            c.reconnectDelay = RECONNECT_DELAY_MS
            c.activate()
        }
    }

    function disconnect() {
        if (client && client.active) {
            manualDeactivate = true
            client.deactivate()
            isConnected.value = false
        }
    }

    function subscribe(topic, callback) {
        ensureClient()

        // 같은 토픽 재구독 시 콜백만 교체
        const existing = subscriptions.get(topic)
        if (existing) {
            existing.callback = callback
            return () => unsubscribe(topic)
        }

        const entry = { callback, sub: null }
        subscriptions.set(topic, entry)

        if (client && client.connected) {
            bindSubscription(topic, entry)
        }

        return () => unsubscribe(topic)
    }

    function unsubscribe(topic) {
        const entry = subscriptions.get(topic)
        if (!entry) return
        if (entry.sub) {
            try {
                entry.sub.unsubscribe()
            } catch (err) {
                console.warn(`[useWebSocket] unsubscribe error (${topic})`, err)
            }
        }
        subscriptions.delete(topic)
    }

    return {
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        isConnected,
    }
}
