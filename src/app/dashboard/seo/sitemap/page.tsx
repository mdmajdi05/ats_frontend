'use client';

import { useEffect, useState } from 'react';
import { GitFork, RefreshCw, Globe, FileText, Image, Video, Newspaper, Settings } from 'lucide-react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface SitemapData {
  staticPages: string[];
  posts: { slug: string; lastmod: string }[];
  categories: { slug: string }[];
  tags: { slug: string }[];
}

interface SplitSitemap {
  pages: { urls: string[]; changefreq: string; priority: number };
  posts: { urls: { loc: string; lastmod: string }[]; changefreq: string; priority: number };
  categories: { urls: { loc: string; lastmod: string }[]; changefreq: string; priority: number };
  tags: { urls: { loc: string }[]; changefreq: string; priority: number };
}

type SitemapTab = 'overview' | 'split' | 'images' | 'videos' | 'news' | 'config';

export default function SitemapPage() {
  const [data, setData] = useState<SitemapData | null>(null);
  const [splitData, setSplitData] = useState<SplitSitemap | null>(null);
  const [imageData, setImageData] = useState<any | null>(null);
  const [videoData, setVideoData] = useState<any | null>(null);
  const [newsData, setNewsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [tab, setTab] = useState<SitemapTab>('overview');
  const [configType, setConfigType] = useState('posts');
  const [priority, setPriority] = useState('0.8');
  const [changefreq, setChangefreq] = useState('weekly');
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    loadSitemap();
    loadAutoUpdate();
  }, []);

  async function loadSitemap() {
    setLoading(true);
    try {
      const res = await request<{ data: SitemapData }>('/seo-manager/sitemap');
      setData(res.data);
    } catch { toast.error('Failed to load sitemap data'); }
    finally { setLoading(false); }
  }

  async function loadAutoUpdate() {
    try {
      const res = await request<{ data: { enabled: boolean } }>('/seo-manager/sitemap/auto-update', { method: 'GET' });
      setAutoUpdate(res.data?.enabled ?? false);
    } catch { /* ignore */ }
  }

  async function regenerate() {
    setRegenerating(true);
    try {
      const res = await request<{ data: { filePath: string; postCount: number } }>('/seo-manager/sitemap/regenerate', { method: 'POST' });
      toast.success(`Sitemap regenerated with ${res.data.postCount} posts`);
    } catch { toast.error('Failed to regenerate sitemap'); }
    finally { setRegenerating(false); }
  }

  async function loadSplit() {
    try {
      const res = await request<{ data: SplitSitemap }>('/seo-manager/sitemap/split');
      setSplitData(res.data);
    } catch { toast.error('Failed to load split sitemap'); }
  }

  async function loadImages() {
    try {
      const res = await request<{ data: any }>('/seo-manager/sitemap/images');
      setImageData(res.data);
    } catch { toast.error('Failed to load image sitemap'); }
  }

  async function loadVideos() {
    try {
      const res = await request<{ data: any }>('/seo-manager/sitemap/videos');
      setVideoData(res.data);
    } catch { toast.error('Failed to load video sitemap'); }
  }

  async function loadNews() {
    try {
      const res = await request<{ data: any }>('/seo-manager/sitemap/news');
      setNewsData(res.data);
    } catch { toast.error('Failed to load news sitemap'); }
  }

  useEffect(() => { if (tab === 'split') loadSplit(); }, [tab]);
  useEffect(() => { if (tab === 'images') loadImages(); }, [tab]);
  useEffect(() => { if (tab === 'videos') loadVideos(); }, [tab]);
  useEffect(() => { if (tab === 'news') loadNews(); }, [tab]);

  async function saveConfig() {
    setSavingConfig(true);
    try {
      await request('/seo-manager/sitemap/config', {
        method: 'PUT',
        body: JSON.stringify({ type: configType, priority: parseFloat(priority), changefreq }),
      });
      toast.success('Sitemap config saved');
    } catch { toast.error('Failed to save config'); }
    finally { setSavingConfig(false); }
  }

  async function toggleAutoUpdate() {
    const newVal = !autoUpdate;
    try {
      await request('/seo-manager/sitemap/auto-update', {
        method: 'PUT',
        body: JSON.stringify({ enabled: newVal }),
      });
      setAutoUpdate(newVal);
      toast.success(`Auto-update ${newVal ? 'enabled' : 'disabled'}`);
    } catch { toast.error('Failed to update'); }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-navy flex items-center gap-2">
            <GitFork className="w-5 h-5 text-orange" />
            Sitemap Manager
          </h1>
          <p className="text-sm text-text-muted mt-1">View, generate, and configure sitemaps</p>
        </div>
        <button onClick={regenerate} disabled={regenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange text-white text-sm font-medium hover:bg-orange/90 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
          Regenerate Sitemap
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['overview', 'split', 'images', 'videos', 'news', 'config'] as SitemapTab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-orange text-white' : 'bg-white border border-silver text-text-muted hover:bg-silver/30'}`}>
            {t === 'overview' && <Globe className="w-4 h-4" />}
            {t === 'split' && <GitFork className="w-4 h-4" />}
            {t === 'images' && <Image className="w-4 h-4" />}
            {t === 'videos' && <Video className="w-4 h-4" />}
            {t === 'news' && <Newspaper className="w-4 h-4" />}
            {t === 'config' && <Settings className="w-4 h-4" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-silver p-5">
            <h3 className="text-sm font-semibold text-navy flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-orange" />
              Static Pages ({data?.staticPages.length || 0})
            </h3>
            <div className="space-y-1">
              {data?.staticPages.map((p) => (
                <div key={p} className="text-sm text-text-muted font-mono">{p}</div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-silver p-5">
            <h3 className="text-sm font-semibold text-navy flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-orange" />
              Blog Posts ({data?.posts.length || 0})
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {data?.posts.map((p) => (
                <div key={p.slug} className="text-sm text-text-muted font-mono flex justify-between">
                  <span>/blog/{p.slug}</span>
                  <span className="text-xs">{new Date(p.lastmod).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Split Sitemap Tab */}
      {tab === 'split' && splitData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['pages', 'posts', 'categories', 'tags'] as const).map((type) => (
            <div key={type} className="bg-white rounded-xl border border-silver p-5">
              <h3 className="text-sm font-semibold text-navy flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-orange" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
                <span className="text-xs text-text-muted font-normal">
                  ({(splitData as any)[type]?.urls?.length || 0}) · {splitData[type as keyof typeof splitData]?.changefreq} · {splitData[type as keyof typeof splitData]?.priority}
                </span>
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-1 text-xs font-mono text-text-muted">
                {(splitData as any)[type]?.urls?.slice(0, 20).map((u: any, i: number) => (
                  <div key={i}>{typeof u === 'string' ? u : u.loc}</div>
                ))}
                {(splitData as any)[type]?.urls?.length > 20 && <div className="text-[#C0C9D5]">… and {(splitData as any)[type].urls.length - 20} more</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Sitemap Tab */}
      {tab === 'images' && (
        <div className="bg-white rounded-xl border border-silver overflow-hidden">
          <div className="p-4 border-b border-silver">
            <h3 className="text-sm font-semibold text-navy">Image Sitemap ({imageData?.total || 0} images)</h3>
          </div>
          {imageData?.images?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-silver/50">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Page</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Image</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Caption</th>
                </tr>
              </thead>
              <tbody>
                {imageData.images.slice(0, 50).map((img: any, i: number) => (
                  <tr key={i} className="border-t border-silver hover:bg-silver/30">
                    <td className="px-4 py-3 font-mono text-xs">{img.loc}</td>
                    <td className="px-4 py-3"><img src={img.image} alt={img.caption || 'Sitemap image'} className="w-12 h-12 object-cover rounded" /></td>
                    <td className="px-4 py-3 text-text-muted">{img.caption}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="p-4 text-sm text-text-muted">No images found in published posts.</div>}
        </div>
      )}

      {/* Video Sitemap Tab */}
      {tab === 'videos' && (
        <div className="bg-white rounded-xl border border-silver overflow-hidden">
          <div className="p-4 border-b border-silver">
            <h3 className="text-sm font-semibold text-navy">Video Sitemap ({videoData?.total || 0} videos)</h3>
          </div>
          {videoData?.videos?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-silver/50">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Page</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Video URL</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Title</th>
                </tr>
              </thead>
              <tbody>
                {videoData.videos.slice(0, 50).map((v: any, i: number) => (
                  <tr key={i} className="border-t border-silver hover:bg-silver/30">
                    <td className="px-4 py-3 font-mono text-xs">{v.loc}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 truncate max-w-[200px]">{v.video}</td>
                    <td className="px-4 py-3 text-text-muted">{v.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="p-4 text-sm text-text-muted">No videos found in published posts.</div>}
        </div>
      )}

      {/* News Sitemap Tab */}
      {tab === 'news' && (
        <div className="bg-white rounded-xl border border-silver overflow-hidden">
          <div className="p-4 border-b border-silver">
            <h3 className="text-sm font-semibold text-navy">News Sitemap ({newsData?.total || 0} articles)</h3>
          </div>
          {newsData?.news?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-silver/50">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">URL</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Title</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold">Published</th>
                </tr>
              </thead>
              <tbody>
                {newsData.news.slice(0, 50).map((n: any, i: number) => (
                  <tr key={i} className="border-t border-silver hover:bg-silver/30">
                    <td className="px-4 py-3 font-mono text-xs">{n.loc}</td>
                    <td className="px-4 py-3 text-navy">{n.news?.title}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{new Date(n.news?.publication_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="p-4 text-sm text-text-muted">No news articles found.</div>}
        </div>
      )}

      {/* Config Tab */}
      {tab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-silver p-5">
            <h3 className="text-sm font-semibold text-navy mb-4">Priority & Frequency</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1">Content Type</label>
                <select value={configType} onChange={(e) => setConfigType(e.target.value)}
                  className="w-full border border-silver rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30">
                  {['pages', 'posts', 'categories', 'tags'].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1">Priority (0.0 - 1.0)</label>
                <input type="range" min="0" max="1" step="0.1" value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="w-full" />
                <span className="text-xs text-text-muted">{priority}</span>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1">Change Frequency</label>
                <select value={changefreq} onChange={(e) => setChangefreq(e.target.value)}
                  className="w-full border border-silver rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30">
                  {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((f) => (
                    <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button onClick={saveConfig} disabled={savingConfig}
                className="bg-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange/90 disabled:opacity-50">
                {savingConfig ? 'Saving…' : 'Save Config'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-silver p-5">
            <h3 className="text-sm font-semibold text-navy mb-4">Auto-Update</h3>
            <p className="text-sm text-text-muted mb-4">Automatically regenerate sitemap when content is published or updated.</p>
            <button onClick={toggleAutoUpdate}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${autoUpdate ? 'bg-green-100 text-green-700' : 'bg-silver/50 text-text-muted'}`}>
              <div className={`w-10 h-5 rounded-full transition-colors ${autoUpdate ? 'bg-green-500' : 'bg-[#C0C9D5]'} relative`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${autoUpdate ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              {autoUpdate ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
