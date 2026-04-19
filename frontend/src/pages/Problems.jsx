import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import toast from 'react-hot-toast';

const Problems = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') === 'contests' ? 'contests' : 'problemset';

    const [loading, setLoading] = useState(true);
    const [problemset, setProblemset] = useState(null);
    const [contests, setContests] = useState(null);
    const [gym, setGym] = useState(false);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const q = searchParams.get('q') || '';
    const tag = searchParams.get('tag') || '';

    const setTab = (t) => {
        const next = new URLSearchParams(searchParams);
        next.set('tab', t);
        next.delete('page');
        setSearchParams(next);
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                if (tab === 'problemset') {
                    const { data } = await api.get('/cf/problemset', {
                        params: { page, pageSize: 40, q, tag }
                    });
                    if (!cancelled) setProblemset(data);
                } else {
                    const { data } = await api.get('/cf/contests', {
                        params: { gym, page, pageSize: 25 }
                    });
                    if (!cancelled) setContests(data);
                }
            } catch (e) {
                if (!cancelled) toast.error(e.response?.data?.message || 'Failed to load from Codeforces');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [tab, page, q, tag, gym]);

    const goPage = (p) => {
        const next = new URLSearchParams(searchParams);
        next.set('page', String(p));
        setSearchParams(next);
    };

    const submitSearch = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const next = new URLSearchParams(searchParams);
        next.set('q', (fd.get('q') || '').toString());
        next.set('tag', (fd.get('tag') || '').toString());
        next.set('page', '1');
        setSearchParams(next);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100">
            <nav className="border-b border-slate-800 bg-[#111827] px-4 py-4 lg:px-8">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <img src="/codesphere-logo.svg" alt="" className="h-9 w-9 rounded-lg" />
                        <div>
                            <h1 className="text-lg font-semibold">Problems</h1>
                            <p className="text-xs text-slate-400">Codeforces problemset & contests</p>
                        </div>
                    </div>
                    <a
                        href="https://codeforces.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hidden items-center gap-1 text-sm text-blue-400 hover:text-blue-300 sm:flex"
                    >
                        codeforces.com <ExternalLink size={14} />
                    </a>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
                <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
                    <button
                        type="button"
                        onClick={() => setTab('problemset')}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            tab === 'problemset' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        Global problemset
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('contests')}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            tab === 'contests' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        Contests
                    </button>
                </div>

                {tab === 'problemset' && (
                    <>
                        <form onSubmit={submitSearch} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label className="mb-1 block text-xs text-slate-400">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <input
                                        name="q"
                                        defaultValue={q}
                                        placeholder="Name or e.g. 1506 A"
                                        className="w-full rounded-lg border border-slate-700 bg-[#111827] py-2.5 pl-10 pr-3 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="sm:w-48">
                                <label className="mb-1 block text-xs text-slate-400">Tag</label>
                                <input
                                    name="tag"
                                    defaultValue={tag}
                                    placeholder="e.g. dp, graphs"
                                    className="w-full rounded-lg border border-slate-700 bg-[#111827] px-3 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-lg bg-slate-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-600"
                            >
                                Apply
                            </button>
                        </form>

                        {loading && (
                            <p className="text-slate-400">
                                Loading problems… (first load may take ~30s while we sync the Codeforces index)
                            </p>
                        )}
                        {!loading && problemset && (
                            <>
                                <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827] shadow-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3">Problem</th>
                                                <th className="hidden px-4 py-3 md:table-cell">Tags</th>
                                                <th className="px-4 py-3">Rating</th>
                                                <th className="hidden px-4 py-3 lg:table-cell">Solved</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {problemset.problems.map((p) => (
                                                <tr key={`${p.contestId}-${p.index}`} className="hover:bg-slate-800/50">
                                                    <td className="px-4 py-3">
                                                        <Link
                                                            to={`/problems/${p.contestId}/${encodeURIComponent(p.index)}`}
                                                            className="font-mono text-blue-400 hover:text-blue-300"
                                                        >
                                                            {p.contestId}
                                                            {p.index}
                                                        </Link>
                                                        <div className="mt-0.5 text-slate-200">{p.name}</div>
                                                    </td>
                                                    <td className="hidden max-w-xs px-4 py-3 md:table-cell">
                                                        <div className="flex flex-wrap gap-1">
                                                            {(p.tags || []).slice(0, 4).map((t) => (
                                                                <span
                                                                    key={t}
                                                                    className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-300"
                                                                >
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-300">{p.rating ?? '—'}</td>
                                                    <td className="hidden px-4 py-3 text-slate-400 lg:table-cell">
                                                        {p.solvedCount?.toLocaleString?.() ?? '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                                    <span>
                                        Page {problemset.page} of {problemset.totalPages} ({problemset.total.toLocaleString()} problems)
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() => goPage(page - 1)}
                                            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-800"
                                        >
                                            <ChevronLeft size={16} /> Prev
                                        </button>
                                        <button
                                            type="button"
                                            disabled={page >= problemset.totalPages}
                                            onClick={() => goPage(page + 1)}
                                            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-800"
                                        >
                                            Next <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {tab === 'contests' && (
                    <>
                        <div className="mb-4 flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={gym}
                                    onChange={(e) => {
                                        setGym(e.target.checked);
                                        const next = new URLSearchParams(searchParams);
                                        next.set('page', '1');
                                        setSearchParams(next);
                                    }}
                                    className="rounded border-slate-600"
                                />
                                Show gym contests
                            </label>
                        </div>
                        {loading && (
                            <p className="text-slate-400">Loading contests… (first visit may be slower)</p>
                        )}
                        {!loading && contests && (
                            <>
                                <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827] shadow-lg">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3">Id</th>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Phase</th>
                                                <th className="hidden px-4 py-3 md:table-cell">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {contests.contests.map((c) => (
                                                <tr key={c.id} className="hover:bg-slate-800/50">
                                                    <td className="px-4 py-3 font-mono text-slate-300">{c.id}</td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/problems/contest/${c.id}`)}
                                                            className="text-left text-blue-400 hover:text-blue-300"
                                                        >
                                                            {c.name}
                                                        </button>
                                                        {c.gym && (
                                                            <span className="ml-2 rounded bg-amber-500/20 px-1.5 text-xs text-amber-300">
                                                                gym
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-400">{c.phase}</td>
                                                    <td className="hidden px-4 py-3 text-slate-400 md:table-cell">
                                                        {c.durationSeconds ? `${Math.round(c.durationSeconds / 3600)}h` : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                                    <span>
                                        Page {contests.page} of {contests.totalPages}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() => goPage(page - 1)}
                                            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-800"
                                        >
                                            <ChevronLeft size={16} /> Prev
                                        </button>
                                        <button
                                            type="button"
                                            disabled={page >= contests.totalPages}
                                            onClick={() => goPage(page + 1)}
                                            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-800"
                                        >
                                            Next <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Problems;
