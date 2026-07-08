import { req } from './blogService';

export interface PageSchema {
  pageKey: string;
  label: string;
  schemaJson: Record<string, unknown> | null;
  faqItems: { question: string; answer: string }[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  robotsIndex: boolean | null;
  robotsFollow: boolean | null;
  canonicalUrl: string | null;
  extraHead: Record<string, unknown> | null;
  updatedAt: string;
  updatedBy: string;
}

type ListResp = { success: true; data: PageSchema[] };
type SingleResp = { success: true; data: PageSchema };
type DeleteResp = { success: true; data: null };

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export const schemaService = {
  list: () => req<ListResp>('/schemas'),
  get: (pageKey: string) => req<SingleResp>(`/schemas/${encodeURIComponent(pageKey)}`),
  getPublic: async (pageKey: string): Promise<PageSchema | null> => {
    try {
      const res = await fetch(`${API}/schemas/public/${encodeURIComponent(pageKey)}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      return null;
    }
  },
  upsert: (pageKey: string, body: {
    label: string;
    schemaJson?: unknown;
    faqItems?: unknown;
    metaTitle?: string | null;
    metaDescription?: string | null;
    ogImage?: string | null;
    robotsIndex?: boolean | null;
    robotsFollow?: boolean | null;
    canonicalUrl?: string | null;
    extraHead?: unknown;
  }) =>
    req<SingleResp>(`/schemas/${encodeURIComponent(pageKey)}`, { method: 'PUT', body: JSON.stringify({ pageKey, ...body }) }),
  delete: (pageKey: string) => req<DeleteResp>(`/schemas/${encodeURIComponent(pageKey)}`, { method: 'DELETE' }),
};
