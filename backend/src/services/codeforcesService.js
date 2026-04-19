const CF_API = 'https://codeforces.com/api';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CONTEST_LIST_TTL_MS = 30 * 60 * 1000; // 30 min

let problemsetCache = {
    data: null,
    fetchedAt: 0
};

let contestListCache = {
    data: null,
    fetchedAt: 0
};

async function fetchCf(method, params = {}) {
    const url = new URL(`${CF_API}/${method}`);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
            url.searchParams.set(k, String(v));
        }
    });
    const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' }
    });
    const json = await res.json();
    if (json.status !== 'OK') {
        const err = new Error(json.comment || 'Codeforces API error');
        err.code = 'CF_API';
        throw err;
    }
    return json.result;
}

export async function getProblemsetProblems() {
    const now = Date.now();
    if (problemsetCache.data && now - problemsetCache.fetchedAt < CACHE_TTL_MS) {
        return problemsetCache.data;
    }
    const result = await fetchCf('problemset.problems');
    problemsetCache = { data: result, fetchedAt: now };
    return result;
}

/**
 * Merged contest.list (gym + non-gym), cached. contest.standings requires auth; we use this for metadata only.
 */
export async function getMergedContestList() {
    const now = Date.now();
    if (contestListCache.data && now - contestListCache.fetchedAt < CONTEST_LIST_TTL_MS) {
        return contestListCache.data;
    }
    const [gymFalse, gymTrue] = await Promise.all([
        fetchCf('contest.list', { gym: 'false' }),
        fetchCf('contest.list', { gym: 'true' })
    ]);
    const byId = new Map();
    gymFalse.forEach((c) => byId.set(c.id, { ...c, gym: false }));
    gymTrue.forEach((c) => byId.set(c.id, { ...c, gym: true }));
    const merged = Array.from(byId.values()).sort((a, b) => b.id - a.id);
    contestListCache = { data: merged, fetchedAt: now };
    return merged;
}

function compareProblemIndex(a, b) {
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Paginated problemset with optional search and tag filter (server-side filter on cached data).
 */
export async function listProblemset({ page = 1, pageSize = 50, query = '', tag = '' }) {
    const { problems, problemStatistics } = await getProblemsetProblems();
    const q = (query || '').trim().toLowerCase();
    const tagLower = (tag || '').trim().toLowerCase();

    let filtered = problems.map((p, i) => {
        const stats = problemStatistics?.[i];
        return {
            contestId: p.contestId,
            index: p.index,
            name: p.name,
            type: p.type,
            points: p.points,
            rating: p.rating,
            tags: p.tags || [],
            solvedCount: stats?.solvedCount ?? stats?.acceptedCount
        };
    });

    if (tagLower) {
        filtered = filtered.filter((p) => p.tags.some((t) => t.toLowerCase() === tagLower));
    }
    if (q) {
        filtered = filtered.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                `${p.contestId}${p.index}`.toLowerCase().includes(q.replace(/\s/g, '')) ||
                `${p.contestId} ${p.index}`.toLowerCase().includes(q)
        );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);

    return {
        problems: slice,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
    };
}

export async function listContests({ gym = false, page = 1, pageSize = 30 }) {
    const all = await getMergedContestList();
    const filtered = gym ? all.filter((c) => c.gym === true) : all.filter((c) => c.gym === false);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize).map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        phase: c.phase,
        frozen: c.frozen,
        durationSeconds: c.durationSeconds,
        startTimeSeconds: c.startTimeSeconds,
        relativeTimeSeconds: c.relativeTimeSeconds,
        preparedBy: c.preparedBy,
        websiteUrl: c.websiteUrl,
        description: c.description,
        difficulty: c.difficulty,
        kind: c.kind,
        icpcRegion: c.icpcRegion,
        country: c.country,
        city: c.city,
        season: c.season,
        gym: c.gym
    }));

    return {
        contests: slice,
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
    };
}

/**
 * Problems for a contest: filtered from global problemset (same source Codeforces uses; no auth).
 */
export async function getContestProblems(contestId) {
    const cid = Number(contestId);
    if (!Number.isFinite(cid)) {
        const err = new Error('Invalid contest id');
        err.code = 'BAD_REQUEST';
        throw err;
    }

    const { problems, problemStatistics } = await getProblemsetProblems();
    const allContests = await getMergedContestList();
    const contest = allContests.find((c) => c.id === cid) || null;

    const out = [];
    for (let i = 0; i < problems.length; i++) {
        const p = problems[i];
        if (p.contestId !== cid) continue;
        const stats = problemStatistics?.[i];
        out.push({
            contestId: p.contestId,
            index: p.index,
            name: p.name,
            type: p.type,
            points: p.points,
            rating: p.rating,
            tags: p.tags || [],
            solvedCount: stats?.solvedCount ?? stats?.acceptedCount
        });
    }

    out.sort((a, b) => compareProblemIndex(a.index, b.index));

    return {
        contest: contest
            ? {
                  id: contest.id,
                  name: contest.name,
                  type: contest.type,
                  phase: contest.phase,
                  durationSeconds: contest.durationSeconds,
                  startTimeSeconds: contest.startTimeSeconds,
                  gym: contest.gym
              }
            : { id: cid, name: `Contest ${cid}`, phase: 'UNKNOWN' },
        problems: out
    };
}

export function problemUrl(contestId, index) {
    return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
}

function normalizeIndex(i) {
    return String(i || '').trim().toUpperCase();
}

export async function getProblemMeta(contestId, index) {
    const { problems, problemStatistics } = await getProblemsetProblems();
    const wantCid = Number(contestId);
    const wantIdx = normalizeIndex(index);
    const idx = problems.findIndex(
        (p) => p.contestId === wantCid && normalizeIndex(p.index) === wantIdx
    );
    if (idx === -1) {
        return null;
    }
    const p = problems[idx];
    const stats = problemStatistics?.[idx];
    return {
        contestId: p.contestId,
        index: p.index,
        name: p.name,
        type: p.type,
        points: p.points,
        rating: p.rating,
        tags: p.tags || [],
        solvedCount: stats?.solvedCount ?? stats?.acceptedCount
    };
}
