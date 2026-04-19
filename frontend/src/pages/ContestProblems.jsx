import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import toast from 'react-hot-toast';

const ContestProblems = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const { data: res } = await api.get(`/cf/contest/${contestId}/problems`);
                if (!cancelled) setData(res);
            } catch (e) {
                if (!cancelled) toast.error(e.response?.data?.message || 'Failed to load contest');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [contestId]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100">
            <nav className="border-b border-slate-800 bg-[#111827] px-4 py-4 lg:px-8">
                <div className="mx-auto flex max-w-6xl items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/problems?tab=contests')}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold">
                            {data?.contest?.name || `Contest ${contestId}`}
                        </h1>
                        <p className="text-xs text-slate-400">
                            {data?.contest?.phase && <span>{data.contest.phase}</span>}
                            {data?.problems?.length != null && (
                                <span className="ml-2">{data.problems.length} problems</span>
                            )}
                        </p>
                    </div>
                    <a
                        href={`https://codeforces.com/contest/${contestId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto hidden items-center gap-1 text-sm text-blue-400 hover:text-blue-300 sm:flex"
                    >
                        On Codeforces <ExternalLink size={14} />
                    </a>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
                {loading && <p className="text-slate-400">Loading…</p>}
                {!loading && data && data.problems.length === 0 && (
                    <p className="text-slate-400">No problems found for this contest in the public index.</p>
                )}
                {!loading && data && data.problems.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827] shadow-lg">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="hidden px-4 py-3 md:table-cell">Tags</th>
                                    <th className="px-4 py-3">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {data.problems.map((p) => (
                                    <tr key={`${p.contestId}-${p.index}`} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-mono">
                                            <Link
                                                to={`/problems/${p.contestId}/${encodeURIComponent(p.index)}`}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                {p.index}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-slate-200">{p.name}</td>
                                        <td className="hidden max-w-md px-4 py-3 md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {(p.tags || []).slice(0, 5).map((t) => (
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ContestProblems;
