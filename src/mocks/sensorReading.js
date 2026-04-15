/**
 * 센서 데이터 mock
 *
 * - generateInitialReadings(count): 초기 슬라이딩 윈도우용 60포인트 생성
 * - generateNextReading(prev): 직전 값 기반 다음 1포인트 생성 (소폭 변동)
 * - SENSOR_THRESHOLDS: 4단계 임계값 (정상/관심/경고/위험 경계)
 *   - PM10, NTC: CLAUDE.md 24절 기준
 *   - CT1, IR: 시연용 임의값 (BE 임계값 API 연결 시 교체 예정)
 */

export const SENSOR_THRESHOLDS = {
    pm10: { interest: 30, warning: 50, danger: 80, max: 120 }, // µg/m³
    ntc: { interest: 40, warning: 55, danger: 70, max: 90 }, // ℃
    ct1: { interest: 1.5, warning: 2.5, danger: 3.5, max: 5 }, // A
    irTempMax: { interest: 50, warning: 65, danger: 80, max: 110 }, // ℃
}

const BASE = {
    pm10: 22,
    ntc: 32,
    ct1: 1.1,
    irTempMax: 42,
}

const JITTER = {
    pm10: 4,
    ntc: 1.5,
    ct1: 0.25,
    irTempMax: 2,
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v))
}

function nextValue(prev, base, jitter, min, max) {
    // 약한 평균 회귀 + 랜덤 변동
    const drift = (base - prev) * 0.08
    const noise = (Math.random() - 0.5) * 2 * jitter
    return clamp(prev + drift + noise, min, max)
}

function formatTime(date) {
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
}

/**
 * 초기 N포인트 생성 — 현재 시각에서 거꾸로 1.5초 간격
 */
export function generateInitialReadings(count = 60, intervalMs = 1500) {
    const readings = []
    let pm10 = BASE.pm10
    let ntc = BASE.ntc
    let ct1 = BASE.ct1
    let ir = BASE.irTempMax

    const now = Date.now()

    for (let i = count - 1; i >= 0; i--) {
        pm10 = nextValue(pm10, BASE.pm10, JITTER.pm10, 0, SENSOR_THRESHOLDS.pm10.max)
        ntc = nextValue(ntc, BASE.ntc, JITTER.ntc, 0, SENSOR_THRESHOLDS.ntc.max)
        ct1 = nextValue(ct1, BASE.ct1, JITTER.ct1, 0, SENSOR_THRESHOLDS.ct1.max)
        ir = nextValue(ir, BASE.irTempMax, JITTER.irTempMax, 0, SENSOR_THRESHOLDS.irTempMax.max)

        const t = new Date(now - i * intervalMs)
        readings.push({
            collectedAt: formatTime(t),
            pm10: Number(pm10.toFixed(1)),
            ntc: Number(ntc.toFixed(1)),
            ct1: Number(ct1.toFixed(2)),
            irTempMax: Number(ir.toFixed(1)),
        })
    }

    return readings
}

/**
 * 직전 reading을 받아 다음 1포인트 생성
 */
export function generateNextReading(prev) {
    const pm10 = nextValue(
        prev ? prev.pm10 : BASE.pm10,
        BASE.pm10,
        JITTER.pm10,
        0,
        SENSOR_THRESHOLDS.pm10.max,
    )
    const ntc = nextValue(
        prev ? prev.ntc : BASE.ntc,
        BASE.ntc,
        JITTER.ntc,
        0,
        SENSOR_THRESHOLDS.ntc.max,
    )
    const ct1 = nextValue(
        prev ? prev.ct1 : BASE.ct1,
        BASE.ct1,
        JITTER.ct1,
        0,
        SENSOR_THRESHOLDS.ct1.max,
    )
    const ir = nextValue(
        prev ? prev.irTempMax : BASE.irTempMax,
        BASE.irTempMax,
        JITTER.irTempMax,
        0,
        SENSOR_THRESHOLDS.irTempMax.max,
    )

    return {
        collectedAt: formatTime(new Date()),
        pm10: Number(pm10.toFixed(1)),
        ntc: Number(ntc.toFixed(1)),
        ct1: Number(ct1.toFixed(2)),
        irTempMax: Number(ir.toFixed(1)),
    }
}
