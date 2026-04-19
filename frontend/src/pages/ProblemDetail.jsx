import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Code2 from 'lucide-react/dist/esm/icons/code-2';
import toast from 'react-hot-toast';

const ProblemDetail = () => {
    const { contestId, problemIndex } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [problem, setProblem] = useState(null);
    const [url, setUrl] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/cf/problem/${contestId}/${problemIndex}`);
                if (!cancelled) {
                    setProblem(data.problem);
                    setUrl(data.url);
                }
            } catch (e) {
                if (!cancelled) toast.error(e.response?.data?.message || 'Problem not found');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [contestId, problemIndex]);

    const openInEditor = () => {
        if (!problem) return;
        const roomId = Math.random().toString(36).substring(2, 12);
        const qs = new URLSearchParams({
            cfContest: String(problem.contestId),
            cfIndex: problem.index,
            cfName: problem.name
        });
        navigate(`/editor/${roomId}?${qs.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100">
            <nav className="border-b border-slate-800 bg-[#111827] px-4 py-4 lg:px-8">
                <div className="mx-auto flex max-w-3xl items-center gap-3">
                    <Link to="/problems" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-semibold">Problem</h1>
                </div>
            </nav>

            <main className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
                {loading && <p className="text-slate-400">Loading…</p>}
                {!loading && problem && (
                    <div className="rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-lg">
                        <div className="mb-2 font-mono text-blue-400">
                            {problem.contestId}
                            {problem.index}
                        </div>
                        <h2 className="mb-4 text-2xl font-bold text-slate-100">{problem.name}</h2>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {(problem.tags || []).map((t) => (
                                <span key={t} className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <dl className="mb-6 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
                            <div>
                                <dt className="text-slate-500">Rating</dt>
                                <dd>{problem.rating ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Points</dt>
                                <dd>{problem.points ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Solved</dt>
                                <dd>{problem.solvedCount?.toLocaleString?.() ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Type</dt>
                                <dd>{problem.type ?? '—'}</dd>
                            </div>
                        </dl>
                        <p className="mb-6 text-sm leading-relaxed text-slate-400">
                            Full statement, samples, and official judging live on Codeforces. Use CodeSphere to collaborate and
                            run code locally with your own input.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={openInEditor}
                                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                            >
                                <Code2 size={18} />
                                Solve in CodeSphere
                            </button>
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                            >
                                Open on Codeforces <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProblemDetail;
