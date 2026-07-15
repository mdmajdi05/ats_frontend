import Dexie, { type Table } from 'dexie';
import type {
  Product, Category, Industry, Testimonial, User,
  RFQ, Order, AuditLog, SystemSettings,
  InventorySubmission, SiteConfig, BackupRecord, CategoryItem,
} from '@/types';

export interface FallbackDB extends Dexie {
  products: Table<Product, string>;
  categories: Table<Category, string>;
  industries: Table<Industry, string>;
  users: Table<User, string>;
  testimonials: Table<Testimonial, string>;
  rfqs: Table<RFQ, string>;
  orders: Table<Order, string>;
  inventory: Table<InventorySubmission, string>;
  customParts: Table<Product, string>;
  auditLogs: Table<AuditLog, string>;
  systemSettings: Table<SystemSettings, string>;
  siteConfig: Table<SiteConfig, string>;
  backups: Table<BackupRecord, string>;
  categoryItems: Table<CategoryItem, string>;
  newsletters: Table<{ id: string; email: string; isActive: boolean; createdAt: string }, string>;
  contactSubmissions: Table<Record<string, unknown>, string>;
  savedParts: Table<{ id: string; productId: string; userId: string; savedAt: string }, string>;
}

const db = new Dexie('AeroTurbineFallback') as FallbackDB;

db.version(1).stores({
  products: 'id, partNumber, nsn, cage, manufacturer, category, fsg, stockStatus, condition',
  categories: 'id, fsg, fsc, name',
  industries: 'id, slug, name',
  users: 'id, email, role',
  testimonials: 'id',
  rfqs: 'id, status, email, createdAt',
  orders: 'id, status, userId',
  inventory: 'id, status',
  customParts: 'id, partNumber, category, createdBy',
  auditLogs: 'id, action, resource, userId, createdAt',
  systemSettings: 'id',
  siteConfig: 'id',
  backups: 'id',
  categoryItems: 'id, categoryId, isActive',
  newsletters: 'id, email, isActive',
  contactSubmissions: 'id, status',
  savedParts: 'id, productId, userId',
});

export default db;
