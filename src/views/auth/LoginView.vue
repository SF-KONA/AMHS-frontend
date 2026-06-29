<template>
    <div class="login-page">
        <div class="login-card">
            <h1 class="login-title">로그인</h1>
            <p class="login-subtitle">AMHS 모니터링 시스템에 접속합니다.</p>

            <form class="login-form" @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">아이디</label>
                    <input
                        id="username"
                        v-model="username"
                        type="text"
                        placeholder="아이디를 입력하세요"
                    />
                </div>

                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>

                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>

                <button type="submit" class="login-button" :disabled="isSubmitting">
                    {{ isSubmitting ? '로그인 중...' : '로그인' }}
                </button>
            </form>

            <div class="login-hint">
                <p>테스트 계정</p>
                <p>- admin / 1234 → ADMIN</p>
                <p>- user / 1234 → USER</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleLogin() {
    errorMessage.value = ''

    if (!username.value || !password.value) {
        errorMessage.value = '아이디와 비밀번호를 입력하세요.'
        return
    }

    if (isSubmitting.value) return
    isSubmitting.value = true

    try {
        const result = await authStore.loginWithApi(
            username.value.trim(),
            password.value,
        )
        if (result.success) {
            router.push('/dashboard')
            return
        }
        errorMessage.value = result.message || '로그인에 실패했습니다.'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    padding: 24px;
}

.login-card {
    width: 100%;
    max-width: 420px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.login-title {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text);
}

.login-subtitle {
    margin: 0 0 24px;
    font-size: 14px;
    color: var(--color-text-muted);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
}

.form-group input {
    height: 44px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    color: var(--color-text);
    background: #fff;
    outline: none;
}

.form-group input:focus {
    border-color: var(--color-interest);
}

.error-message {
    margin: 0;
    font-size: 13px;
    color: var(--color-danger);
}

.login-button {
    height: 44px;
    border: none;
    border-radius: 10px;
    background: var(--color-text);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
}

.login-button:hover {
    opacity: 0.92;
}

.login-hint {
    margin-top: 20px;
    padding: 16px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    font-size: 13px;
    color: var(--color-text-muted);
}

.login-hint p {
    margin: 4px 0;
}
</style>