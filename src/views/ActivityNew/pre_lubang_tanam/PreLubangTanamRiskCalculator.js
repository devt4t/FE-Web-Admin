export const HUMIDITY_MAP = { 0: "Lembab", 1: "Kering" };
export const TIME_CHECKING_MAP = { 0: "Pagi", 1: "Siang", 2: "Sore" };
export const IS_RAINING_MAP = { 0: "Tidak Ada", 1: "Ada" };

export const ASSIGNMENT_STATUS_MAP = {
    0: { label: "Belum Di-assign", color: "bg-secondary" },
    1: { label: "Sudah Di-assign", color: "bg-warning" },
    2: { label: "Complete", color: "bg-success" },
};

const isDefined = (val) => val !== null && val !== undefined && val !== "";

export function evaluateSampleRisk(sample) {
    if (!sample || !sample.checked_at || !isDefined(sample.humidity)) {
        return { score: null, status: "PENDING" };
    }

    // Placeholder Rule (Sementara sebelum rumus resmi Manager turun)
    // humidity: 0=lembab, 1=kering | is_raining: 0=tidak ada, 1=ada | risk_tier: A/B/C
    let riskScore = 0;

    if (Number(sample.humidity) === 1) riskScore += 50;
    if (Number(sample.is_raining) === 0) riskScore += 30;
    if (sample.risk_tier === "A") riskScore += 20;
    else if (sample.risk_tier === "B") riskScore += 10;

    const status = riskScore >= 60 ? "DELAY" : "GO";
    return { score: riskScore, status };
}

export function evaluateFFAggregatedRisk(samples = []) {
    const checkedSamples = (samples || []).filter(
        (s) => s.checked_at && isDefined(s.humidity)
    );

    if (checkedSamples.length === 0) {
        return { avgScore: null, dominantHumidity: null, recommendation: null };
    }

    let totalScore = 0;
    let keringCount = 0;

    checkedSamples.forEach((s) => {
        const { score } = evaluateSampleRisk(s);
        totalScore += score;
        if (Number(s.humidity) === 1) keringCount++;
    });

    const avgScore = Math.round(totalScore / checkedSamples.length);
    const dominantHumidity = keringCount > checkedSamples.length / 2 ? 1 : 0;
    const recommendation = avgScore >= 60 ? "DELAY" : "GO";

    return { avgScore, dominantHumidity, recommendation };
}