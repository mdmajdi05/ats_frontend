'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface HistoryEntry {
  type: 'input' | 'output' | 'error';
  text: string;
}

export default function TerminalPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', text: 'Web Terminal v1.0 — Type a command and press Enter.' },
    { type: 'output', text: 'Allowed: ls, dir, pwd, cat, echo, node -v, npm -v, npx, git, whoami, hostname, date, uptime' },
  ]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const execute = useCallback(async (command: string) => {
    setHistory((prev) => [...prev, { type: 'input', text: `$ ${command}` }]);
    try {
      const res = await request<{ data: { stdout: string; stderr: string } }>('/dev/terminal/exec', {
        method: 'POST',
        body: JSON.stringify({ command }),
      });
      if (res.data?.stdout) {
        setHistory((prev) => [...prev, { type: 'output', text: res.data.stdout }]);
      }
      if (res.data?.stderr) {
        setHistory((prev) => [...prev, { type: 'error', text: res.data.stderr }]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Command failed';
      setHistory((prev) => [...prev, { type: 'error', text: msg }]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    setCmdHistory((prev) => [cmd, ...prev].slice(0, 100));
    setHistoryIdx(-1);
    setInput('');
    await execute(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx + 1 < cmdHistory.length ? historyIdx + 1 : historyIdx;
      setHistoryIdx(Math.min(nextIdx, cmdHistory.length - 1));
      setInput(cmdHistory[Math.min(nextIdx, cmdHistory.length - 1)]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setInput('');
        return;
      }
      const nextIdx = historyIdx - 1;
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-emerald-400" />
          Web Terminal
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Execute whitelisted shell commands on the server.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black overflow-hidden">
        <div
          ref={outputRef}
          className="h-[500px] overflow-y-auto p-4 font-mono text-sm space-y-1"
          onClick={() => inputRef.current?.focus()}
          style={{ backgroundColor: '#000', color: '#00ff00' }}
        >
          {history.map((entry, i) => (
            <div key={i} className="whitespace-pre-wrap break-all">
              {entry.type === 'input' ? (
                <span className="text-green-400">{entry.text}</span>
              ) : entry.type === 'error' ? (
                <span className="text-red-400">{entry.text}</span>
              ) : (
                <span className="text-green-300/80">{entry.text}</span>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-white/10 flex items-center px-4 py-3" style={{ backgroundColor: '#000' }}>
          <span className="text-green-400 font-mono text-sm mr-2">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-green-300 font-mono text-sm outline-none placeholder-green-700"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
