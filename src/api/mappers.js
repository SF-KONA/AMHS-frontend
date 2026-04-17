/**
 * BE → FE 필드 변환 유틸
 *
 * BE 스키마 vs FE 컨벤션 차이를 흡수.
 * 순수 함수만 모음. 사이드이펙트 없음.
 */

const FAB_NAMES = {
    'FAB-A': 'Fab A (반도체)',
    'FAB-B': 'Fab B (디스플레이)',
}

/**
 * deviceType → fabId 추론
 * (GET /api/equipments 목록 API가 fabId를 안 주므로 deviceType으로 추정)
 */
export function deviceTypeToFabId(deviceType) {
    if (deviceType === 'OHT') return 'FAB-A'
    if (deviceType === 'AGV') return 'FAB-B'
    return null
}

/**
 * 장비 목록 API 응답 item 변환
 * - fabId가 응답에 있으면 그대로, 없으면 deviceType 기반 추론
 */
export function mapEquipmentListItem(be) {
    if (!be) return be
    return {
        ...be,
        fabId: be.fabId || deviceTypeToFabId(be.deviceType),
    }
}

/**
 * 장비 상세 API 응답 변환 (fabId 포함, pass-through)
 */
export function mapEquipmentDetail(be) {
    if (!be) return be
    return { ...be }
}

/**
 * 장비 목록에서 fabs/lines 구조 합성
 * - 대시보드가 fabs → lines → 장비 3단 구조를 기대하므로
 * - fabId/lineId 기준 그룹핑해서 생성
 * - totalSlots = 해당 라인 실제 장비 수
 * - minRunning = 70% 비율로 스케일 (CLAUDE.md의 7/10 비율 유지)
 */
export function synthesizeFabsFromEquipment(equipmentList) {
    const fabMap = new Map()

    equipmentList.forEach((eq) => {
        if (!eq.fabId || !eq.lineId) return

        if (!fabMap.has(eq.fabId)) {
            fabMap.set(eq.fabId, {
                fabId: eq.fabId,
                fabName: FAB_NAMES[eq.fabId] || eq.fabId,
                lines: new Map(),
            })
        }

        const fab = fabMap.get(eq.fabId)
        if (!fab.lines.has(eq.lineId)) {
            fab.lines.set(eq.lineId, {
                lineId: eq.lineId,
                lineName: eq.lineId,
                deviceType: eq.deviceType,
                totalSlots: 0,
                minRunning: 0,
            })
        }
        // 라인 장비 수 카운트
        fab.lines.get(eq.lineId).totalSlots += 1
    })

    // minRunning = 70% of totalSlots (올림)
    fabMap.forEach((fab) => {
        fab.lines.forEach((line) => {
            line.minRunning = Math.max(1, Math.ceil(line.totalSlots * 0.7))
        })
    })

    // lineId 오름차순으로 정렬 + Fab도 정렬
    return Array.from(fabMap.values())
        .sort((a, b) => String(a.fabId).localeCompare(String(b.fabId)))
        .map((fab) => ({
            ...fab,
            lines: Array.from(fab.lines.values()).sort((a, b) =>
                String(a.lineId).localeCompare(String(b.lineId)),
            ),
        }))
}

/**
 * 센서 reading 변환
 * BE: { pm10, ntcTemp, ct1Current, irMaxTemp, timestamp }
 * FE: { pm10, ntc, ct1, irTempMax, collectedAt }
 */
export function mapSensorReading(be) {
    if (!be) return null
    return {
        pm10: be.pm10,
        ntc: be.ntcTemp,
        ct1: be.ct1Current,
        irTempMax: be.irMaxTemp,
        collectedAt: formatCollectedAt(be.timestamp),
    }
}

/**
 * ISO timestamp → HH:MM:SS (차트 x축용 짧은 표기)
 */
function formatCollectedAt(iso) {
    if (!iso) return ''
    const m = String(iso).match(/T(\d{2}:\d{2}:\d{2})/)
    return m ? m[1] : String(iso)
}

/**
 * 알림 변환
 * BE: alertLevel(Byte 1/2/3) → FE: level 문자열 (기존 FE 컴포넌트 호환)
 *   1 → IDLE (관심, 파랑)
 *   2 → WARNING (경고, 주황)
 *   3 → ERROR (위험, 빨강)
 */
export function mapAlert(be) {
    if (!be) return be
    return {
        alertId: be.alertId,
        deviceId: be.deviceId,
        level: alertLevelToString(be.alertLevel),
        sensorName: be.sensorName,
        sensorValue: be.sensorValue,
        acknowledged: be.acknowledged,
        createdAt: be.createdAt,
        ackAt: be.ackAt,
    }
}

function alertLevelToString(level) {
    switch (Number(level)) {
        case 1:
            return 'IDLE'
        case 2:
            return 'WARNING'
        case 3:
            return 'ERROR'
        default:
            return 'IDLE'
    }
}
