<template>
    <Teleport to="body">
        <div class="toast-container">
            <transition-group name="toast" tag="div" class="toast-stack">
                <div
                    v-for="toast in toasts"
                    :key="toast.toastId"
                    :class="['toast', `toast-${levelKey(toast.level)}`]"
                    role="alert"
                    @click="alertStore.removeToast(toast.toastId)"
                >
                    <div class="toast-bar"></div>
                    <div class="toast-content">
                        <div class="toast-header">
                            <span class="toast-dot" :style="{ background: levelColor(toast.level) }"></span>
                            <span class="toast-title">{{ levelLabel(toast.level) }}</span>
                            <button
                                type="button"
                                class="toast-close"
                                aria-label="닫기"
                                @click.stop="alertStore.removeToast(toast.toastId)"
                            >
                                ×
                            </button>
                        </div>
                        <div class="toast-body">
                            <span v-if="toast.eqId" class="toast-eq">{{ toast.eqId }}</span>
                            <span v-if="toast.sensorName" class="toast-sensor">
                                {{ toast.sensorName }}
                                <template v-if="toast.sensorValue !== undefined && toast.sensorValue !== null">
                                    {{ toast.sensorValue }}
                                </template>
                            </span>
                            <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useAlertStore } from '../../stores/alertStore'

const alertStore = useAlertStore()
const toasts = computed(() => alertStore.toastQueue)

const LEVEL_LABEL = {
    ERROR: '위험',
    WARNING: '경고',
    IDLE: '관심',
    NORMAL: '정상',
}

const LEVEL_COLOR = {
    ERROR: 'var(--color-danger)',
    WARNING: 'var(--color-warning)',
    IDLE: 'var(--color-interest)',
    NORMAL: 'var(--color-normal)',
}

function levelKey(level) {
    const key = (level || 'warning').toLowerCase()
    return ['error', 'warning', 'idle', 'normal'].includes(key) ? key : 'warning'
}

function levelLabel(level) {
    return LEVEL_LABEL[(level || '').toUpperCase()] || '알림'
}

function levelColor(level) {
    return LEVEL_COLOR[(level || '').toUpperCase()] || 'var(--color-warning)'
}
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    pointer-events: none;
}

.toast-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
}

.toast {
    pointer-events: auto;
    cursor: pointer;
    min-width: 280px;
    max-width: 360px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    display: flex;
    overflow: hidden;
}

.toast:hover {
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
}

.toast-bar {
    width: 4px;
    flex-shrink: 0;
}

.toast-error .toast-bar {
    background: var(--color-danger);
}
.toast-warning .toast-bar {
    background: var(--color-warning);
}
.toast-idle .toast-bar {
    background: var(--color-interest);
}
.toast-normal .toast-bar {
    background: var(--color-normal);
}

.toast-content {
    flex: 1;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.toast-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.toast-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.toast-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text);
}

.toast-close {
    margin-left: auto;
    background: transparent;
    border: none;
    font-size: 18px;
    line-height: 1;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0 2px;
}

.toast-close:hover {
    color: var(--color-text);
}

.toast-body {
    font-size: 13px;
    color: var(--color-text);
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: baseline;
}

.toast-eq {
    font-weight: 700;
}

.toast-sensor {
    color: var(--color-text-muted);
}

.toast-message {
    flex-basis: 100%;
    font-size: 12px;
    color: var(--color-text-muted);
    margin-top: 2px;
}

/* 트랜지션 */
.toast-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
