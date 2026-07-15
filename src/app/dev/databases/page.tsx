'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Database, Plus, Trash2, Activity, RefreshCw, Server, Table, Columns3, Terminal,
  Play, Download, Upload, FileJson, Copy, CheckCircle2, XCircle, Archive,
  ArrowLeftRight, GitCompare, Shield, ShieldOff, Settings, GripVertical, Save, Plug,
} from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

const DB_PROVIDERS = [
  { value: 'neon', label: 'Neon (Serverless PostgreSQL)', color: '#00E599' },
  { value: 'postgres', label: 'PostgreSQL (Self-hosted)', color: '#336791' },
  { value: 'mysql', label: 'MySQL / MariaDB', color: '#4479A1' },
  { value: 'mongodb', label: 'MongoDB', color: '#47A248' },
] as const;

interface DBConnection {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  config: Record<string, unknown>;
  dataTypes: string[];
  createdAt: string;
}

interface PingResult {
  id: string;
  name: string;
  status: 'connected' | 'error';
  latency: number;
  error?: string;
}

interface TableSchema {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface IndexInfo {
  indexname: string;
  indexdef: string;
}

export default function DatabasesPage() {
  // DB Provider Config (file-based, overrides .env)
  const [dbUseEnv, setDbUseEnv] = useState(true);
  const [dbProvider, setDbProvider] = useState<string>('neon');
  const [dbUrl, setDbUrl] = useState('');
  const [dbDirectUrl, setDbDirectUrl] = useState('');
  const [dbEnvValues, setDbEnvValues] = useState<{ provider: string; databaseUrl: string; directDatabaseUrl: string }>({ provider: 'neon', databaseUrl: '', directDatabaseUrl: '' });
  const [dbConfigLoaded, setDbConfigLoaded] = useState(false);
  const [dbConfigSaving, setDbConfigSaving] = useState(false);

  // Connection state
  const [connections, setConnections] = useState<DBConnection[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected connection for explorer
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Explorer state
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [dataPage, setDataPage] = useState(1);
  const [dataTotal, setDataTotal] = useState(0);
  const [explorerLoading, setExplorerLoading] = useState(false);

  // Query runner
  const [queryText, setQueryText] = useState('');
  const [queryResult, setQueryResult] = useState<Record<string, unknown>[] | null>(null);
  const [queryColumns, setQueryColumns] = useState<string[]>([]);
  const [queryDuration, setQueryDuration] = useState<number | null>(null);
  const [queryRunning, setQueryRunning] = useState(false);

  // Ping
  const [pinging, setPinging] = useState<Set<string>>(new Set());
  const [pingResults, setPingResults] = useState<Record<string, PingResult>>({});

  // Rename
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Import / Export / Compress
  const [showImport, setShowImport] = useState(false);
  const [importModel, setImportModel] = useState('');
  const [importStrategy, setImportStrategy] = useState<'create' | 'upsert'>('create');
  const [importDataText, setImportDataText] = useState('');
  const [exportModel, setExportModel] = useState('');
  const [exportData, setExportData] = useState<Record<string, unknown>[] | null>(null);
  const [compressedOutput, setCompressedOutput] = useState('');
  const [compressInput, setCompressInput] = useState('');
  const [decompressInput, setDecompressInput] = useState('');

  // Hybrid mode
  const [showHybrid, setShowHybrid] = useState(false);
  const [hybridForm, setHybridForm] = useState({ entityType: '', storageType: 'json', filePath: '', dbConnectionId: '' });

  // Migration
  const [showMigration, setShowMigration] = useState(false);
  const [moveForm, setMoveForm] = useState({ sourceConnectionId: '', targetConnectionId: '', entityTypes: '' });
  const [compareIds, setCompareIds] = useState({ id1: '', id2: '' });
  const [compareResult, setCompareResult] = useState<Record<string, unknown> | null>(null);
  const [rollbackConnId, setRollbackConnId] = useState('');

  const loadDbConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/dev/db-config');
      const json = await res.json();
      if (json.env) {
        setDbEnvValues({ provider: json.env.provider || 'neon', databaseUrl: json.env.databaseUrl || '', directDatabaseUrl: json.env.directDatabaseUrl || '' });
      }
      if (json.data) {
        setDbUseEnv(json.data.useEnvConfig === true);
        setDbProvider(json.data.provider || 'neon');
        setDbUrl(json.data.databaseUrl || '');
        setDbDirectUrl(json.data.directDatabaseUrl || '');
      } else {
        setDbUseEnv(true);
        setDbProvider(json.env?.provider || 'neon');
        setDbUrl(json.env?.databaseUrl || '');
        setDbDirectUrl(json.env?.directDatabaseUrl || '');
      }
    } catch { /* ignore */ }
    setDbConfigLoaded(true);
  }, []);

  const saveDbConfig = async () => {
    if (!dbUseEnv && !dbUrl) { toast.error('Database URL is required'); return; }
    setDbConfigSaving(true);
    try {
      const body = dbUseEnv
        ? { useEnvConfig: true }
        : { useEnvConfig: false, provider: dbProvider, databaseUrl: dbUrl, directDatabaseUrl: dbDirectUrl || undefined };
      const res = await fetch('/api/dev/db-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || 'Saved!');
      } else {
        toast.error(json.error || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save configuration');
    }
    setDbConfigSaving(false);
  };

  const fetchConnections = useCallback(async () => {
    try {
      const res = await request<{ data: DBConnection[] }>('/dev/db');
      setConnections(res.data || []);
    } catch {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConnections(); loadDbConfig(); }, [fetchConnections, loadDbConfig]);

  // ── Explorer ─────────────────────────────────────────────

  const selectConnection = async (id: string) => {
    setSelectedConnectionId(id);
    setSelectedTable(null);
    setSchema([]);
    setTableData([]);
    setTableColumns([]);
    setQueryResult(null);
    setExplorerLoading(true);
    try {
      const res = await request<{ data: string[] }>(`/dev/databases/explorer/${id}/tables`);
      setTables(res.data || []);
    } catch {
      toast.error('Failed to fetch tables');
    } finally {
      setExplorerLoading(false);
    }
  };

  const selectTable = async (table: string) => {
    setSelectedTable(table);
    setDataPage(1);
    setExplorerLoading(true);
    try {
      const [schemaRes, dataRes] = await Promise.all([
        request<{ data: { columns: TableSchema[]; indexes: IndexInfo[] } }>(
          `/dev/databases/explorer/${selectedConnectionId}/tables/${table}/schema`
        ),
        request<{ data: Record<string, unknown>[]; pagination: { total: number } }>(
          `/dev/databases/explorer/${selectedConnectionId}/tables/${table}/data?page=1&limit=50`
        ),
      ]);
      setSchema(schemaRes.data.columns || []);
      setIndexes(schemaRes.data.indexes || []);
      setTableData(dataRes.data || []);
      setDataTotal(dataRes.pagination?.total || 0);
      const cols = schemaRes.data.columns?.map((c) => c.column_name) || [];
      setTableColumns(cols);
    } catch {
      toast.error('Failed to fetch table data');
    } finally {
      setExplorerLoading(false);
    }
  };

  const loadDataPage = async (page: number) => {
    if (!selectedConnectionId || !selectedTable) return;
    setDataPage(page);
    setExplorerLoading(true);
    try {
      const res = await request<{ data: Record<string, unknown>[]; pagination: { total: number } }>(
        `/dev/databases/explorer/${selectedConnectionId}/tables/${selectedTable}/data?page=${page}&limit=50`
      );
      setTableData(res.data || []);
      setDataTotal(res.pagination?.total || 0);
    } catch {
      toast.error('Failed to load page');
    } finally {
      setExplorerLoading(false);
    }
  };

  // ── Ping ─────────────────────────────────────────────────

  const pingDb = async (id: string) => {
    setPinging((prev) => new Set(prev).add(id));
    try {
      const res = await request<{ data: PingResult }>(`/dev/databases/db/${id}/ping`);
      setPingResults((prev) => ({ ...prev, [id]: res.data }));
      toast.success(`Ping: ${res.data.status} (${res.data.latency}ms)`);
    } catch {
      toast.error('Ping failed');
    } finally {
      setPinging((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  // ── Rename ───────────────────────────────────────────────

  const startRename = (conn: DBConnection) => {
    setRenaming(conn.id);
    setRenameValue(conn.name);
  };

  const saveRename = async () => {
    if (!renaming || !renameValue.trim()) return;
    try {
      await request(`/dev/databases/db/${renaming}/rename`, {
        method: 'PUT',
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      toast.success('Database renamed');
      setRenaming(null);
      fetchConnections();
    } catch {
      toast.error('Rename failed');
    }
  };

  // ── Clone ────────────────────────────────────────────────

  const cloneDb = async (id: string) => {
    try {
      await request(`/dev/databases/db/${id}/clone`, { method: 'POST' });
      toast.success('Database cloned');
      fetchConnections();
    } catch {
      toast.error('Clone failed');
    }
  };

  // ── Encrypt ──────────────────────────────────────────────

  const toggleEncrypt = async (id: string) => {
    try {
      await request(`/dev/databases/db/${id}/encrypt`, { method: 'POST' });
      toast.success('Encryption toggled');
      fetchConnections();
    } catch {
      toast.error('Toggle failed');
    }
  };

  // ── Set Default ──────────────────────────────────────────

  const setDefault = async (id: string) => {
    try {
      await request(`/dev/databases/db/${id}/set-default`, { method: 'POST' });
      toast.success('Default database set');
      fetchConnections();
    } catch {
      toast.error('Failed to set default');
    }
  };

  // ── Archive ──────────────────────────────────────────────

  const archiveDb = async (id: string) => {
    if (!confirm('Archive this database connection?')) return;
    try {
      await request(`/dev/databases/db/${id}/archive`, { method: 'POST' });
      toast.success('Database archived');
      fetchConnections();
    } catch {
      toast.error('Archive failed');
    }
  };

  // ── Query Runner ────────────────────────────────────────

  const runQuery = async () => {
    if (!selectedConnectionId || !queryText.trim()) return;
    setQueryRunning(true);
    setQueryResult(null);
    try {
      const res = await request<{ data: Record<string, unknown>[]; duration: number; rowCount: number }>(
        `/dev/databases/explorer/${selectedConnectionId}/query`,
        { method: 'POST', body: JSON.stringify({ query: queryText }) }
      );
      setQueryResult(res.data || []);
      setQueryDuration(res.duration);
      const cols = (res.data && res.data.length > 0) ? Object.keys(res.data[0]) : [];
      setQueryColumns(cols);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setQueryRunning(false);
    }
  };

  // ── Export / Import / Compress ──────────────────────────

  const handleExport = async () => {
    if (!exportModel) { toast.error('Model name required'); return; }
    try {
      const res = await request<{ data: Record<string, unknown>[] }>('/dev/databases/data/export', {
        method: 'POST',
        body: JSON.stringify({ model: exportModel, take: 1000 }),
      });
      setExportData(res.data || []);
      toast.success(`Exported ${(res.data || []).length} records`);
    } catch {
      toast.error('Export failed');
    }
  };

  const handleImport = async () => {
    if (!importModel || !importDataText) { toast.error('Model and data required'); return; }
    let data: Record<string, unknown>[];
    try {
      data = JSON.parse(importDataText);
      if (!Array.isArray(data)) throw new Error('Must be array');
    } catch {
      toast.error('Invalid JSON array');
      return;
    }
    try {
      const res = await request<{ data: { imported: number } }>('/dev/databases/data/import', {
        method: 'POST',
        body: JSON.stringify({ model: importModel, data, strategy: importStrategy }),
      });
      toast.success(`Imported ${res.data?.imported || 0} records`);
    } catch {
      toast.error('Import failed');
    }
  };

  const handleCompress = async () => {
    if (!compressInput) { toast.error('Enter data to compress'); return; }
    let parsed: unknown;
    try { parsed = JSON.parse(compressInput); } catch { parsed = compressInput; }
    try {
      const res = await request<{ data: { compressed: string; originalSize: number; compressedSize: number } }>(
        '/dev/databases/data/compress', { method: 'POST', body: JSON.stringify({ data: parsed }) }
      );
      setCompressedOutput(res.data.compressed);
      toast.success(`Compressed: ${res.data.originalSize} → ${res.data.compressedSize} bytes`);
    } catch {
      toast.error('Compress failed');
    }
  };

  const handleDecompress = async () => {
    if (!decompressInput) { toast.error('Enter compressed data'); return; }
    try {
      const res = await request<{ data: unknown }>('/dev/databases/data/decompress', {
        method: 'POST',
        body: JSON.stringify({ compressed: decompressInput }),
      });
      setCompressInput(JSON.stringify(res.data, null, 2));
      toast.success('Decompressed');
    } catch {
      toast.error('Decompress failed');
    }
  };

  // ── Hybrid Mode ─────────────────────────────────────────

  const saveHybrid = async () => {
    if (!hybridForm.entityType) { toast.error('Entity type required'); return; }
    try {
      await request('/dev/databases/hybrid', {
        method: 'PUT',
        body: JSON.stringify(hybridForm),
      });
      toast.success('Hybrid mode updated');
      setShowHybrid(false);
    } catch {
      toast.error('Failed to set hybrid mode');
    }
  };

  // ── Migration ───────────────────────────────────────────

  const handleMoveData = async () => {
    if (!moveForm.sourceConnectionId || !moveForm.targetConnectionId || !moveForm.entityTypes) {
      toast.error('All fields required');
      return;
    }
    try {
      await request('/dev/databases/move', {
        method: 'POST',
        body: JSON.stringify({
          sourceConnectionId: moveForm.sourceConnectionId,
          targetConnectionId: moveForm.targetConnectionId,
          entityTypes: moveForm.entityTypes.split(',').map((s) => s.trim()),
        }),
      });
      toast.success('Data moved');
    } catch {
      toast.error('Move failed');
    }
  };

  const handleCompare = async () => {
    if (!compareIds.id1 || !compareIds.id2) { toast.error('Select two databases'); return; }
    try {
      const res = await request<{ data: Record<string, unknown> }>('/dev/databases/compare', {
        method: 'POST',
        body: JSON.stringify({ connectionId1: compareIds.id1, connectionId2: compareIds.id2 }),
      });
      setCompareResult(res.data);
    } catch {
      toast.error('Compare failed');
    }
  };

  const handleRollback = async () => {
    if (!rollbackConnId) { toast.error('Select a connection'); return; }
    try {
      await request('/dev/databases/rollback', {
        method: 'POST',
        body: JSON.stringify({ connectionId: rollbackConnId }),
      });
      toast.success('Rollback initiated');
    } catch {
      toast.error('Rollback failed');
    }
  };

  // ── Handlers ────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this connection?')) return;
    try {
      await request(`/dev/db/${id}`, { method: 'DELETE' });
      toast.success('Connection removed');
      fetchConnections();
    } catch {
      toast.error('Failed to remove connection');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await request(`/dev/db/${id}/activate`, { method: 'POST' });
      toast.success('Connection activated');
      fetchConnections();
    } catch {
      toast.error('Failed to activate');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Database className="w-6 h-6 text-emerald-400 animate-pulse" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            Database Admin
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage, explore, and migrate database connections.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-xl transition-colors border border-white/10">
            <Upload className="w-4 h-4" /> {showImport ? 'Hide' : 'Import'}
          </button>
          <button onClick={() => setShowHybrid(!showHybrid)} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-xl transition-colors border border-white/10">
            <Settings className="w-4 h-4" /> {showHybrid ? 'Hide' : 'Hybrid'}
          </button>
          <button onClick={() => setShowMigration(!showMigration)} className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-xl transition-colors border border-white/10">
            <ArrowLeftRight className="w-4 h-4" /> {showMigration ? 'Hide' : 'Migrate'}
          </button>
        </div>
      </div>

      {/* Database Provider Configuration */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-900/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plug className="w-4 h-4 text-emerald-400" /> Database Provider Configuration
            </h3>
            <p className="text-xs text-white/40 mt-0.5">Switch between Neon, PostgreSQL, MySQL, or MongoDB. Changes require a backend restart.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
              <span className={dbUseEnv ? 'text-emerald-400 font-medium' : 'text-white/40'}>Use .env</span>
              <button
                onClick={() => setDbUseEnv(!dbUseEnv)}
                className={`relative w-10 h-5 rounded-full transition-colors ${dbUseEnv ? 'bg-emerald-600' : 'bg-purple-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${dbUseEnv ? 'translate-x-0' : 'translate-x-5'}`} />
              </button>
              <span className={!dbUseEnv ? 'text-emerald-400 font-medium' : 'text-white/40'}>Custom</span>
            </label>
            <button
              onClick={saveDbConfig}
              disabled={dbConfigSaving || (!dbUseEnv && !dbUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Save className="w-4 h-4" /> {dbConfigSaving ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </div>

        {dbUseEnv ? (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 space-y-2">
            <p className="text-xs text-emerald-400/80 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Using .env configuration
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-white/40">Provider:</span>{' '}
                <span className="text-white/80 font-mono">{dbEnvValues.provider}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-white/40">DATABASE_URL:</span>{' '}
                <span className="text-white/60 font-mono break-all">{dbEnvValues.databaseUrl || '—'}</span>
              </div>
            </div>
            <p className="text-xs text-white/30">Switch to Custom to override with a different provider/connection string.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Provider</label>
                <select
                  value={dbProvider}
                  onChange={(e) => setDbProvider(e.target.value)}
                  disabled={dbUseEnv}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 disabled:opacity-40"
                >
                  {DB_PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">DATABASE_URL</label>
                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  disabled={dbUseEnv}
                  placeholder={dbProvider === 'mongodb' ? 'mongodb+srv://...' : 'postgresql://user:pass@host:5432/db'}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/50 disabled:opacity-40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">DIRECT_DATABASE_URL <span className="text-white/30">(optional, for migrations)</span></label>
                <input
                  type="text"
                  value={dbDirectUrl}
                  onChange={(e) => setDbDirectUrl(e.target.value)}
                  disabled={dbUseEnv}
                  placeholder="Leave empty to use DATABASE_URL"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/50 disabled:opacity-40"
                />
              </div>
            </div>
            {dbProvider === 'neon' && (
              <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-4 py-2.5">
                <span>Neon free tier has data transfer limits. If quota exceeded, switch to self-hosted PostgreSQL or upgrade your Neon plan.</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Import / Export / Compress Panel */}
      {showImport && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Upload className="w-4 h-4 text-emerald-400" /> Import / Export / Compress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Export */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Export</h4>
              <input value={exportModel} onChange={(e) => setExportModel(e.target.value)} placeholder="Model name (e.g. User)" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
              <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
                <Download className="w-4 h-4" /> Export
              </button>
              {exportData && (
                <pre className="text-xs text-white/70 bg-[#1A1A1A] p-3 rounded-xl max-h-40 overflow-auto">{JSON.stringify(exportData.slice(0, 5), null, 2)}</pre>
              )}
            </div>
            {/* Import */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Import</h4>
              <input value={importModel} onChange={(e) => setImportModel(e.target.value)} placeholder="Model name" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
              <select value={importStrategy} onChange={(e) => setImportStrategy(e.target.value as 'create' | 'upsert')} className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                <option value="create">Create</option>
                <option value="upsert">Upsert</option>
              </select>
              <textarea value={importDataText} onChange={(e) => setImportDataText(e.target.value)} placeholder='[{ "field": "value" }]' rows={3} className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none" />
              <button onClick={handleImport} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
                <Upload className="w-4 h-4" /> Import
              </button>
            </div>
            {/* Compress */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Compress / Decompress</h4>
              <textarea value={compressInput} onChange={(e) => setCompressInput(e.target.value)} placeholder='JSON data to compress' rows={2} className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none" />
              <div className="flex gap-2">
                <button onClick={handleCompress} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
                  <FileJson className="w-4 h-4" /> Compress
                </button>
                <button onClick={handleDecompress} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">
                  <FileJson className="w-4 h-4" /> Decompress
                </button>
              </div>
              <textarea value={decompressInput} onChange={(e) => setDecompressInput(e.target.value)} placeholder='Base64 compressed data to decompress' rows={2} className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none" />
              {compressedOutput && <pre className="text-xs text-white/70 bg-[#1A1A1A] p-3 rounded-xl max-h-20 overflow-auto break-all">{compressedOutput}</pre>}
            </div>
          </div>
        </div>
      )}

      {/* Hybrid Mode Panel */}
      {showHybrid && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Settings className="w-4 h-4 text-emerald-400" /> Hybrid Mode Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={hybridForm.entityType} onChange={(e) => setHybridForm({ ...hybridForm, entityType: e.target.value })} placeholder="Entity type (e.g. Part)" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
            <select value={hybridForm.storageType} onChange={(e) => setHybridForm({ ...hybridForm, storageType: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50">
              <option value="json">JSON (file)</option>
              <option value="excel">Excel (file)</option>
              <option value="db">Database</option>
            </select>
            <input value={hybridForm.filePath} onChange={(e) => setHybridForm({ ...hybridForm, filePath: e.target.value })} placeholder="File path (optional)" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
            <input value={hybridForm.dbConnectionId} onChange={(e) => setHybridForm({ ...hybridForm, dbConnectionId: e.target.value })} placeholder="DB Connection ID (optional)" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
          </div>
          <button onClick={saveHybrid} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors">Save Hybrid Config</button>
        </div>
      )}

      {/* Migration Panel */}
      {showMigration && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-emerald-400" /> Migration, Sync & Compare</h3>

          {/* Move Data */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-white/60">Move Data Between Connections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={moveForm.sourceConnectionId} onChange={(e) => setMoveForm({ ...moveForm, sourceConnectionId: e.target.value })} placeholder="Source connection ID" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
              <input value={moveForm.targetConnectionId} onChange={(e) => setMoveForm({ ...moveForm, targetConnectionId: e.target.value })} placeholder="Target connection ID" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
              <input value={moveForm.entityTypes} onChange={(e) => setMoveForm({ ...moveForm, entityTypes: e.target.value })} placeholder="Entity types (comma-separated)" className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
            </div>
            <button onClick={handleMoveData} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
              <ArrowLeftRight className="w-4 h-4" /> Move Data
            </button>
          </div>

          {/* Compare */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-white/60">Compare Database Configs</h4>
            <div className="flex gap-3">
              <input value={compareIds.id1} onChange={(e) => setCompareIds({ ...compareIds, id1: e.target.value })} placeholder="Connection ID 1" className="flex-1 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
              <input value={compareIds.id2} onChange={(e) => setCompareIds({ ...compareIds, id2: e.target.value })} placeholder="Connection ID 2" className="flex-1 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
              <button onClick={handleCompare} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
                <GitCompare className="w-4 h-4" /> Compare
              </button>
            </div>
            {compareResult && (
              <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 space-y-2">
                <p className="text-sm text-white"><span className="text-emerald-400">{String(compareResult.db1 && (compareResult.db1 as Record<string, unknown>).name)}</span> vs <span className="text-emerald-400">{String(compareResult.db2 && (compareResult.db2 as Record<string, unknown>).name)}</span></p>
                {compareResult.sameConfig === true && <p className="text-xs text-green-400">Configs are identical</p>}
                {Array.isArray(compareResult.differences) && (compareResult.differences as string[]).length > 0 && (
                  <ul className="list-disc list-inside text-xs text-yellow-400 space-y-1">
                    {(compareResult.differences as string[]).map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Rollback */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-white/60">Rollback Migration</h4>
            <div className="flex gap-3">
              <input value={rollbackConnId} onChange={(e) => setRollbackConnId(e.target.value)} placeholder="Connection ID" className="flex-1 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
              <button onClick={handleRollback} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors">
                <RefreshCw className="w-4 h-4" /> Rollback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Connections + Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connections List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2"><Database className="w-4 h-4 text-emerald-400" /> Connections</h2>
          {connections.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <Database className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-white/50 text-xs">No connections configured.</p>
            </div>
          ) : (
            connections.map((c) => {
              const ping = pingResults[c.id];
              return (
                <div
                  key={c.id}
                  className={`rounded-2xl border p-4 transition-colors cursor-pointer ${
                    selectedConnectionId === c.id
                      ? 'border-emerald-500/50 bg-emerald-900/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => selectConnection(c.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Server className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="min-w-0">
                        {renaming === c.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-24 px-2 py-1 rounded-lg bg-[#1A1A1A] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/50"
                            />
                            <button onClick={(e) => { e.stopPropagation(); saveRename(); }} className="text-emerald-400 text-xs">Save</button>
                            <button onClick={(e) => { e.stopPropagation(); setRenaming(null); }} className="text-white/40 text-xs">Cancel</button>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-white truncate">{c.name}</p>
                        )}
                        <p className="text-xs text-white/40">{c.type}{c.isDefault ? ' (default)' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {ping?.status === 'connected' && <span className="text-[10px] text-green-400">{ping.latency}ms</span>}
                      {ping?.status === 'error' && <XCircle className="w-3 h-3 text-red-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); pingDb(c.id); }}
                      disabled={pinging.has(c.id)}
                      className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                      title="Ping"
                    >
                      <Activity className={`w-3.5 h-3.5 ${pinging.has(c.id) ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); startRename(c); }} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Rename">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); cloneDb(c.id); }} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Clone">
                      <Database className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleEncrypt(c.id); }} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Toggle Encryption">
                      {c.config?.encrypted ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                    </button>
                    {!c.isActive && (
                      <button onClick={(e) => { e.stopPropagation(); handleActivate(c.id); }} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Activate">
                        <Activity className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {!c.isDefault && (
                      <button onClick={(e) => { e.stopPropagation(); setDefault(c.id); }} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Set as default">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); archiveDb(c.id); }} className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Archive">
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="p-1 rounded-lg hover:bg-red-900/30 text-white/40 hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Explorer */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedConnectionId ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <Table className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">Select a database connection to explore</p>
            </div>
          ) : (
            <>
              {/* Table List */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Table className="w-4 h-4 text-emerald-400" /> Tables
                </h3>
                {explorerLoading && tables.length === 0 ? (
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Loading tables...
                  </div>
                ) : tables.length === 0 ? (
                  <p className="text-white/30 text-xs">No tables found</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tables.map((t) => (
                      <button
                        key={t}
                        onClick={() => selectTable(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedTable === t
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Schema */}
              {schema.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                    <Columns3 className="w-4 h-4 text-emerald-400" /> Schema: {selectedTable}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-white/40 border-b border-white/10">
                          <th className="text-left py-2 pr-4">Column</th>
                          <th className="text-left py-2 pr-4">Type</th>
                          <th className="text-left py-2 pr-4">Nullable</th>
                          <th className="text-left py-2">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schema.map((col) => (
                          <tr key={col.column_name} className="border-b border-white/5 text-white/70">
                            <td className="py-1.5 pr-4 font-medium text-white">{col.column_name}</td>
                            <td className="py-1.5 pr-4">{col.data_type}</td>
                            <td className="py-1.5 pr-4">{col.is_nullable === 'YES' ? <span className="text-green-400">YES</span> : <span className="text-red-400">NO</span>}</td>
                            <td className="py-1.5">{col.column_default || <span className="text-white/20">—</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {indexes.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-white/60 mb-2">Indexes</h4>
                      <div className="space-y-1">
                        {indexes.map((idx) => (
                          <p key={idx.indexname} className="text-xs text-white/50 bg-[#1A1A1A] p-2 rounded-lg font-mono">{idx.indexdef}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Data Browser */}
              {tableColumns.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" /> Data: {selectedTable}
                    </h3>
                    <div className="flex items-center gap-2">
                      {explorerLoading && <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />}
                      <span className="text-xs text-white/40">{dataTotal} rows</span>
                    </div>
                  </div>
                  {tableData.length === 0 ? (
                    <p className="text-white/30 text-xs">No data</p>
                  ) : (
                    <>
                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-white/40 border-b border-white/10 sticky top-0 bg-[#1A1A1A]">
                              {tableColumns.map((col) => (
                                <th key={col} className="text-left py-2 pr-4 whitespace-nowrap">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row, i) => (
                              <tr key={i} className="border-b border-white/5 text-white/70 hover:bg-white/5">
                                {tableColumns.map((col) => (
                                  <td key={col} className="py-1.5 pr-4 whitespace-nowrap max-w-[200px] truncate">
                                    {String(row[col] ?? '')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadDataPage(dataPage - 1)}
                            disabled={dataPage <= 1}
                            className="px-3 py-1 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 disabled:opacity-30"
                          >
                            Previous
                          </button>
                          <span className="text-xs text-white/40">Page {dataPage} of {Math.ceil(dataTotal / 50)}</span>
                          <button
                            onClick={() => loadDataPage(dataPage + 1)}
                            disabled={dataPage >= Math.ceil(dataTotal / 50)}
                            className="px-3 py-1 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 disabled:opacity-30"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Query Runner */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4 text-emerald-400" /> SQL Query Runner
                </h3>
                <textarea
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="SELECT * FROM &quot;table_name&quot; LIMIT 10"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
                <button
                  onClick={runQuery}
                  disabled={queryRunning || !queryText.trim()}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <Play className="w-4 h-4" /> {queryRunning ? 'Running...' : 'Run Query'}
                  {queryDuration !== null && <span className="text-xs text-white/60 ml-2">{queryDuration}ms</span>}
                </button>
                {queryResult && (
                  <div className="mt-3 overflow-x-auto max-h-80 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-white/40 border-b border-white/10 sticky top-0 bg-[#1A1A1A]">
                          {queryColumns.map((col) => (
                            <th key={col} className="text-left py-2 pr-4 whitespace-nowrap">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 text-white/70 hover:bg-white/5">
                            {queryColumns.map((col) => (
                              <td key={col} className="py-1.5 pr-4 whitespace-nowrap max-w-[200px] truncate">{String(row[col] ?? '')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-white/40 mt-2">{queryResult.length} rows returned</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
