import React, { useRef, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useCollaboration } from '../hooks/useCollaboration';
import Editor from '../components/Editor';
import api from '../services/api';
import Users from 'lucide-react/dist/esm/icons/users';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import Play from 'lucide-react/dist/esm/icons/play';
import TerminalSquare from 'lucide-react/dist/esm/icons/terminal-square';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import toast from 'react-hot-toast';

const LANGUAGES = [
    { id: 'python', name: 'Python 3' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'c', name: 'C' }
];

const EditorPage = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const { ydoc, awareness, users } = useCollaboration(roomId);

    const cfContest = searchParams.get('cfContest');
    const cfIndex = searchParams.get('cfIndex');
    const cfName = searchParams.get('cfName');
    const cfProblemUrl =
        cfContest && cfIndex
            ? `https://codeforces.com/problemset/problem/${cfContest}/${encodeURIComponent(cfIndex)}`
            : null;

    const [copied, setCopied] = useState(false);
    const [language, setLanguage] = useState('python');
    const [isExecuting, setIsExecuting] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [executionMetrics, setExecutionMetrics] = useState(null);
    const [stdin, setStdin] = useState('');

    const editorRef = useRef(null);

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        toast.success('Room ID copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const runCode = async () => {
        if (!editorRef.current) return;

        const code = editorRef.current.getCode();
        if (!code.trim()) {
            toast.error('Please write some code to execute.');
            return;
        }

        setIsExecuting(true);
        setOutput('');
        setError('');
        setExecutionMetrics(null);

        try {
            const { data } = await api.post('/code/execute', {
                code,
                language,
                stdin
            });

            if (data.success) {
                setOutput(data.output);
                setError(data.error);
                setExecutionMetrics({
                    time: data.executionTime,
                    exitCode: data.exitCode,
                    timedOut: data.timedOut
                });
                toast.success(data.error ? 'Execution completed with errors' : 'Execution completed');
            } else {
                setError(data.message || 'Execution failed.');
            }
        } catch (err) {
            console.error('Execution error:', err);
            setError(err.response?.data?.message || 'Failed to connect to execution server.');
        } finally {
            setIsExecuting(false);
        }
    };

    const copyShareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Collaborative link copied to clipboard!');
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#0f172a] text-slate-100">
            <nav className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-4 py-3 shadow-sm lg:px-6">
                <div className="flex items-center gap-4">
                    <Link to="/" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-2">
                        <img src="/codesphere-logo.svg" alt="CodeSphere logo" className="h-8 w-8 rounded-lg" />
                        <h1 className="hidden text-lg font-semibold tracking-tight sm:block">
                            CodeSphere <span className="text-blue-400">Editor</span>
                        </h1>
                    </div>
                    <div className="hidden h-6 w-px bg-slate-700 sm:block"></div>
                    <div className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs sm:flex">
                        <span className="text-slate-400">Room:</span>
                        <span className="max-w-[120px] truncate">{roomId}</span>
                        <button onClick={copyRoomId} className="ml-1 text-slate-500 transition hover:text-blue-400">
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none sm:text-sm"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={runCode}
                        disabled={isExecuting}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
                    >
                        {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                        Run
                    </button>
                    <button
                        onClick={copyShareLink}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold transition hover:bg-blue-500 active:scale-[0.98] sm:px-4 sm:text-sm"
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                </div>
            </nav>

            {cfProblemUrl && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/90 px-4 py-2 text-sm text-slate-300 lg:px-6">
                    <div>
                        <span className="text-slate-500">Codeforces · </span>
                        <span className="font-mono text-blue-400">
                            {cfContest}
                            {cfIndex}
                        </span>
                        {cfName && <span className="ml-2 text-slate-200">{decodeURIComponent(cfName)}</span>}
                    </div>
                    <a
                        href={cfProblemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline-offset-2 hover:underline"
                    >
                        Open full statement on Codeforces
                    </a>
                </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col gap-4 bg-[#0f172a] p-4 lg:flex-row">
                <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-800 bg-[#111827] shadow-[0_8px_20px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
                        <span className="text-sm font-medium text-slate-200">Editor</span>
                        <div className="hidden items-center -space-x-2 sm:flex">
                            {users.map((remoteUser, index) => (
                                <img
                                    key={index}
                                    src={remoteUser.avatar}
                                    className="h-7 w-7 rounded-full border-2 border-[#111827]"
                                    alt={remoteUser.name}
                                    title={remoteUser.name}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden rounded-b-xl bg-[#111827]">
                        <Editor ref={editorRef} ydoc={ydoc} awareness={awareness} language={language} />
                    </div>
                </section>

                <section className="flex min-h-0 w-full flex-col gap-4 lg:w-[34%]">
                    <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 shadow-[0_8px_20px_rgba(15,23,42,0.35)]">
                        <label className="mb-2 block text-sm font-medium text-slate-300">Custom Input (stdin)</label>
                        <textarea
                            value={stdin}
                            onChange={(e) => setStdin(e.target.value)}
                            className="h-28 w-full resize-none rounded-lg border border-slate-700 bg-[#0f172a] p-3 font-mono text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter input here..."
                        />
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-slate-800 bg-[#111827] shadow-[0_8px_20px_rgba(15,23,42,0.35)]">
                        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                <TerminalSquare size={15} />
                                Output
                            </div>
                            {executionMetrics && (
                                <div className="text-xs text-slate-400">
                                    <span className="mr-3">Time: {executionMetrics.time}ms</span>
                                    <span>
                                        Exit:{' '}
                                        <span className={executionMetrics.exitCode === 0 ? 'text-emerald-400' : 'text-red-400'}>
                                            {executionMetrics.exitCode}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm">
                            {isExecuting ? (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    Running...
                                </div>
                            ) : output || error ? (
                                <div className="space-y-3">
                                    {output && (
                                        <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-[#0f172a] p-3 text-slate-200">
                                            {output}
                                        </pre>
                                    )}
                                    {error && (
                                        <pre className="whitespace-pre-wrap rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-300">
                                            {error}
                                        </pre>
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-500">Run code to see output...</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <footer className="flex items-center gap-3 border-t border-slate-800 bg-[#111827] px-4 py-2 text-xs text-slate-400 lg:px-6">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Connected
                </div>
                <span className="h-4 w-px bg-slate-700"></span>
                <div className="flex items-center gap-1.5">
                    <Users size={13} />
                    {users.length} Active {users.length === 1 ? 'User' : 'Users'}
                </div>
                <span className="ml-auto hidden font-mono sm:block">{roomId}</span>
            </footer>
        </div>
    );
};

export default EditorPage;
