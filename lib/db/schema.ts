import { pgTable, uuid, text, timestamp, decimal, boolean, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password'),
  role: text('role').notNull().default('student'), // admin, student
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  useCase: text('use_case'),
  status: text('status').notNull().default('new'), // new, registered, paid
  referralCode: text('referral_code'),
  phone: text('phone'),
  source: text('source').default('landing'), // landing, audit, workshop
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').references(() => leads.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('INR'),
  cashfreeOrderId: text('cashfree_order_id'),
  cashfreePaymentId: text('cashfree_payment_id'),
  status: text('status').notNull().default('pending'), // pending, success, failed
  plan: text('plan').notNull(), // starter, pro, business, workshop
  hasUpsell: boolean('has_upsell').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const referrals = pgTable('referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  referrerId: uuid('referrer_id').references(() => leads.id),
  uses: integer('uses').default(0),
  maxUses: integer('max_uses').default(10),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})