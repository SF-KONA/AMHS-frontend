<template>
    <section class="alert-feed">
        <div class="feed-header">
            <h3 class="feed-title">최근 알림</h3>
            <router-link to="/alerts" class="feed-link">전체 보기 →</router-link>
        </div>

        <ul v-if="recentAlerts.length > 0" class="feed-list">
            <li
                v-for="alert in recentAlerts"
                :key="alert.alertId"
                class="feed-item"
                :class="{ 'is-acknowledged': alert.acknowledged }"
                @click="goToDetail(alert.eqId)"
            >
                <span
                    class="feed-dot"
                    :style="{ background: alert.acknowledged ? '#a0a4ad' : levelColor(alert.level) }"
                ></span>
                <div class="feed-body">
                    <div class="feed-line">
                        <span class="feed-time">{{ formatTime(alert.createdAt) }}</span>
                        <span class="feed-eq">{{ alert.eqId }}</span>
                        <span
                            class="feed-level"
                            :style="{ color: alert.acknowledged ? '#a0a4ad' : levelColor(alert.level) }"
                        >
                            {{ levelLabel(alert.level) }}
                        </span>
                    </div>
                    <div class="feed-meta">
                        {{ alert.sensorName }}
                        <template v-if="alert.sensorValue !== undefined && alert.sensorValue !== null">
                            : <strong>{{ alert.sensorValue }}</strong>
                        </template>
                        <span v-if="alert.acknowledged" class="feed-ack">· 확인 완료</span>
                    </div>
                </div>
            </li>
        </ul>

        <div v-else class="feed-empty">아직 발생한 알림이 없습니다.</div>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAlertStore } from '../../stores/alertStore'

const router = useRouter()
const alertStore = useAlertStore()

const LEVEL_COLOR = {
    ERROR: '#dc2626',
    WARNING: '#d97706',
    IDLE: '#2563eb',
    NORMAL: '#059669',
}

const LEVEL_LABEL = {
    ERROR: '위험',
    WARNING: '경고',
    IDLE: '관심',
    NORMAL: '정상',
}

const recentAlerts = computed(() => {
    return [...alertStore.alertList]
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
        .slice(0, 5)
})

function levelColor(level) {
    return LEVEL_COLOR[(level || '').toUpperCase()] || '#5a6070'
}

function levelLabel(level) {
    return LEVEL_LABEL[(level || '').toUpperCase()] || '알림'
}

function formatTime(createdAt) {
    if (!createdAt) return ''
    // '2026-04-15 09:10:00' → '09:10'
    const m = String(createdAt).match(/(\d{2}:\d{2})/)
    return m ? m[1] : String(createdAt)
}

function goToDetail(eqId) {
    if (eqId) {
        router.push(`/dashboard/${eqId}`)
    }
}
</script>

<style scoped>
.alert-feed {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
}

.feed-header {
    display: flex;
    align-items: baseline;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-border);
}

.feed-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text);
}

.feed-link {
    margin-left: auto;
    font-size: 12px;
    color: var(--color-interest);
    text-decoration: none;
}

.feed-link:hover {
    text-decoration: underline;
}

.feed-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.feed-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
}

.feed-item:hover {
    background: var(--color-bg);
}

.feed-item.is-acknowledged {
    opacity: 0.55;
    background: var(--color-bg);
}

.feed-item.is-acknowledged .feed-eq {
    color: var(--color-text-muted);
    text-decoration: line-through;
    text-decoration-thickness: 1px;
}

.feed-item.is-acknowledged .feed-time,
.feed-item.is-acknowledged .feed-meta {
    color: var(--color-text-muted);
}

.feed-item.is-acknowledged:hover {
    background: var(--color-border);
}

.feed-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
}

.feed-body {
    flex: 1;
    min-width: 0;
}

.feed-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 13px;
}

.feed-time {
    color: var(--color-text-muted);
    font-variant-numeric: tabular-nums;
    font-size: 12px;
}

.feed-eq {
    font-weight: 700;
    color: var(--color-text);
}

.feed-level {
    margin-left: auto;
    font-size: 12px;
    font-weight: 700;
}

.feed-meta {
    margin-top: 2px;
    font-size: 12px;
    color: var(--color-text-muted);
}

.feed-ack {
    margin-left: 4px;
}

.feed-empty {
    padding: 24px 0;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 13px;
}
</style>
