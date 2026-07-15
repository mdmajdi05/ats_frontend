'use client';

import { useEffect, useState, useMemo } from 'react';
import { request } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface Tag {
  id: string; name: string; slug: string; _count?: { posts: number };
}
interface Category {
  id: string; name: string; slug: string; description?: string | null; _count?: { posts: number };
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
}

type TabType = 'tags' | 'categories';

export default function TagsCategoriesPage() {
  const [tab, setTab] = useState<TabType>('tags');

  // Tags state
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagLoading, setTagLoading] = useState(true);
  const [tagModal, setTagModal] = useState<null | 'create' | Tag>(null);
  const [tagName, setTagName] = useState('');
  const [tagSaving, setTagSaving] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [tagDeleteConfirm, setTagDeleteConfirm] = useState<Tag | null>(null);
  const [tagSortBy, setTagSortBy] = useState<'name' | 'posts'>('name');

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catModal, setCatModal] = useState<null | 'create' | Category>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSaving, setCatSaving] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [catDeleteConfirm, setCatDeleteConfirm] = useState<Category | null>(null);
  const [catSortBy, setCatSortBy] = useState<'name' | 'posts'>('name');

  const filteredTags = useMemo(() => {
    const arr = tags.filter((t) => t.name.toLowerCase().includes(tagSearch.toLowerCase()));
    if (tagSortBy === 'posts') arr.sort((a, b) => (b._count?.posts ?? 0) - (a._count?.posts ?? 0));
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [tags, tagSearch, tagSortBy]);

  const filteredCategories = useMemo(() => {
    const arr = categories.filter((c) => c.name.toLowerCase().includes(catSearch.toLowerCase()));
    if (catSortBy === 'posts') arr.sort((a, b) => (b._count?.posts ?? 0) - (a._count?.posts ?? 0));
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [categories, catSearch, catSortBy]);

  async function loadTags() {
    setTagLoading(true);
    try { const r = await request<{ data: Tag[] }>('/blog/tags'); setTags(r.data || []); }
    catch { toast.error('Failed to load tags'); }
    finally { setTagLoading(false); }
  }

  async function loadCategories() {
    setCatLoading(true);
    try { const r = await request<{ data: Category[] }>('/blog/categories'); setCategories(r.data || []); }
    catch { toast.error('Failed to load categories'); }
    finally { setCatLoading(false); }
  }

  useEffect(() => { loadTags(); loadCategories(); }, []);

  // Tag handlers
  function openTagCreate() { setTagName(''); setTagModal('create'); }
  function openTagEdit(t: Tag) { setTagName(t.name); setTagModal(t); }

  async function handleTagSave() {
    if (!tagName.trim()) { toast.error('Name is required'); return; }
    setTagSaving(true);
    try {
      if (tagModal === 'create') {
        await request('/blog/tags', { method: 'POST', body: JSON.stringify({ name: tagName }) });
        toast.success('Tag created');
      } else if (tagModal && typeof tagModal !== 'string') {
        await request(`/blog/tags/${tagModal.id}`, { method: 'PUT', body: JSON.stringify({ name: tagName }) });
        toast.success('Tag updated');
      }
      setTagModal(null);
      loadTags();
    } catch (e: any) { toast.error(e.message); }
    finally { setTagSaving(false); }
  }

  async function handleTagDelete(id: string) {
    try { await request(`/blog/tags/${id}`, { method: 'DELETE' }); toast.success('Deleted'); loadTags(); }
    catch { toast.error('Failed'); }
    finally { setTagDeleteConfirm(null); }
  }

  // Category handlers
  function openCatCreate() { setCatName(''); setCatDesc(''); setCatModal('create'); }
  function openCatEdit(c: Category) { setCatName(c.name); setCatDesc(c.description ?? ''); setCatModal(c); }

  async function handleCatSave() {
    if (!catName.trim()) { toast.error('Name is required'); return; }
    setCatSaving(true);
    try {
      if (catModal === 'create') {
        await request('/blog/categories', { method: 'POST', body: JSON.stringify({ name: catName, description: catDesc }) });
        toast.success('Category created');
      } else if (catModal && typeof catModal !== 'string') {
        await request(`/blog/categories/${catModal.id}`, { method: 'PUT', body: JSON.stringify({ name: catName, description: catDesc }) });
        toast.success('Category updated');
      }
      setCatModal(null);
      loadCategories();
    } catch (e: any) { toast.error(e.message); }
    finally { setCatSaving(false); }
  }

  async function handleCatDelete(id: string) {
    try { await request(`/blog/categories/${id}`, { method: 'DELETE' }); toast.success('Deleted'); loadCategories(); }
    catch { toast.error('Failed'); }
    finally { setCatDeleteConfirm(null); }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-widest mb-1">Content Manager</p>
            <h1 className="text-2xl font-bold text-[#0A1628]">Tags & Categories</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('tags')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${tab === 'tags' ? 'bg-[#4F46E5] text-white' : 'bg-white border border-[#E8EDF2] text-[#4A4A6A] hover:bg-[#F8FAFC]'}`}>
            Tags ({tags.length})
          </button>
          <button onClick={() => setTab('categories')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${tab === 'categories' ? 'bg-[#4F46E5] text-white' : 'bg-white border border-[#E8EDF2] text-[#4A4A6A] hover:bg-[#F8FAFC]'}`}>
            Categories ({categories.length})
          </button>
        </div>

        {/* Tags Panel */}
        {tab === 'tags' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C0C9D5]" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  <input type="text" value={tagSearch} onChange={(e) => setTagSearch(e.target.value)} placeholder="Search tags..." className="w-56 border border-[#E8EDF2] rounded-lg pl-9 pr-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                </div>
                <select value={tagSortBy} onChange={(e) => setTagSortBy(e.target.value as 'name' | 'posts')}
                  className="border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm text-[#4A4A6A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                  <option value="name">Sort by Name</option>
                  <option value="posts">Sort by Posts</option>
                </select>
              </div>
              <button onClick={openTagCreate}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
                + Add Tag
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EDF2] overflow-hidden">
              {tagLoading ? (
                <div className="flex flex-wrap gap-3 p-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-7 w-20 bg-[#E8EDF2] rounded-full animate-pulse" />
                  ))}
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="text-center py-12 text-[#C0C9D5]">
                  {tagSearch ? `No tags matching "${tagSearch}"` : 'No tags yet.'}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E8EDF2]">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">Slug</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">Posts</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EDF2]">
                    {filteredTags.map((t) => (
                      <tr key={t.id} className="hover:bg-[#F8FAFC]">
                        <td className="px-5 py-3 font-medium text-[#0A1628]">{t.name}</td>
                        <td className="px-5 py-3 text-[#4A4A6A] font-mono text-xs">{t.slug}</td>
                        <td className="px-5 py-3 text-[#4A4A6A]">{t._count?.posts ?? 0}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-3 justify-end">
                            <button onClick={() => openTagEdit(t)} className="text-xs text-[#4F46E5] hover:underline font-medium">Edit</button>
                            <button onClick={() => setTagDeleteConfirm(t)} className="text-xs text-red-400 hover:underline font-medium">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Tag delete confirm */}
            {tagDeleteConfirm !== null && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                  <h2 className="font-bold text-[#0A1628] text-lg mb-2">Delete Tag</h2>
                  <p className="text-sm text-[#4A4A6A] mb-1">Are you sure you want to delete <strong>{tagDeleteConfirm.name}</strong>?</p>
                  {tagDeleteConfirm._count?.posts ? (
                    <p className="text-xs text-red-500 font-medium">This tag is used in {tagDeleteConfirm._count.posts} post{tagDeleteConfirm._count.posts > 1 ? 's' : ''}.</p>
                  ) : null}
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => setTagDeleteConfirm(null)} className="flex-1 border border-[#E8EDF2] text-[#4A4A6A] font-medium text-sm py-2.5 rounded-lg hover:bg-[#F8FAFC]">Cancel</button>
                    <button onClick={() => handleTagDelete(tagDeleteConfirm.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            )}

            {/* Tag modal */}
            {tagModal !== null && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                  <h2 className="font-bold text-[#0A1628] text-lg mb-4">{tagModal === 'create' ? 'New Tag' : 'Edit Tag'}</h2>
                  <div className="space-y-3">
                    <input type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Tag name"
                      className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                    <div>
                      <label className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider block mb-1">Slug (auto)</label>
                      <input type="text" value={toSlug(tagName)} readOnly
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm font-mono bg-[#F8FAFC] text-[#4A4A6A]" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => setTagModal(null)} className="flex-1 border border-[#E8EDF2] text-[#4A4A6A] font-medium text-sm py-2.5 rounded-lg">Cancel</button>
                    <button onClick={handleTagSave} disabled={tagSaving}
                      className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm py-2.5 rounded-lg disabled:opacity-50">
                      {tagSaving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Categories Panel */}
        {tab === 'categories' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C0C9D5]" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  <input type="text" value={catSearch} onChange={(e) => setCatSearch(e.target.value)} placeholder="Search categories..." className="w-56 border border-[#E8EDF2] rounded-lg pl-9 pr-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                </div>
                <select value={catSortBy} onChange={(e) => setCatSortBy(e.target.value as 'name' | 'posts')}
                  className="border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm text-[#4A4A6A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30">
                  <option value="name">Sort by Name</option>
                  <option value="posts">Sort by Posts</option>
                </select>
              </div>
              <button onClick={openCatCreate}
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
                + Add Category
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EDF2] overflow-hidden">
              {catLoading ? (
                <div className="divide-y divide-[#E8EDF2]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-5 py-4 animate-pulse flex justify-between">
                      <div className="h-4 bg-[#E8EDF2] rounded w-32" />
                      <div className="h-4 bg-[#E8EDF2] rounded w-10" />
                    </div>
                  ))}
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12 text-[#C0C9D5]">
                  {catSearch ? `No categories matching "${catSearch}"` : 'No categories yet.'}
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E8EDF2]">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">Slug</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">Description</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider">Posts</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EDF2]">
                    {filteredCategories.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC]">
                        <td className="px-5 py-3 font-medium text-[#0A1628]">{c.name}</td>
                        <td className="px-5 py-3 text-[#4A4A6A] font-mono text-xs">{c.slug}</td>
                        <td className="px-5 py-3 text-[#C0C9D5] text-xs max-w-[180px] truncate">{c.description || '—'}</td>
                        <td className="px-5 py-3 text-[#4A4A6A]">{c._count?.posts ?? 0}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-3 justify-end">
                            <button onClick={() => openCatEdit(c)} className="text-xs text-[#4F46E5] hover:underline font-medium">Edit</button>
                            <button onClick={() => setCatDeleteConfirm(c)} className="text-xs text-red-400 hover:underline font-medium">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Category delete confirm */}
            {catDeleteConfirm !== null && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                  <h2 className="font-bold text-[#0A1628] text-lg mb-2">Delete Category</h2>
                  <p className="text-sm text-[#4A4A6A] mb-1">Are you sure you want to delete <strong>{catDeleteConfirm.name}</strong>?</p>
                  {catDeleteConfirm._count?.posts ? (
                    <p className="text-xs text-red-500 font-medium">This category has {catDeleteConfirm._count.posts} post{catDeleteConfirm._count.posts > 1 ? 's' : ''}.</p>
                  ) : null}
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => setCatDeleteConfirm(null)} className="flex-1 border border-[#E8EDF2] text-[#4A4A6A] font-medium text-sm py-2.5 rounded-lg hover:bg-[#F8FAFC]">Cancel</button>
                    <button onClick={() => handleCatDelete(catDeleteConfirm.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            )}

            {/* Category modal */}
            {catModal !== null && (
              <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                  <h2 className="font-bold text-[#0A1628] text-lg mb-4">{catModal === 'create' ? 'New Category' : 'Edit Category'}</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider block mb-1">Name</label>
                      <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. MRO Insights"
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider block mb-1">Slug (auto)</label>
                      <input type="text" value={toSlug(catName)} readOnly
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm font-mono bg-[#F8FAFC] text-[#4A4A6A]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#4A4A6A] uppercase tracking-wider block mb-1">Description</label>
                      <textarea rows={2} value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Optional description"
                        className="w-full border border-[#E8EDF2] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => setCatModal(null)} className="flex-1 border border-[#E8EDF2] text-[#4A4A6A] font-medium text-sm py-2.5 rounded-lg hover:bg-[#F8FAFC]">Cancel</button>
                    <button onClick={handleCatSave} disabled={catSaving}
                      className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50">
                      {catSaving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
