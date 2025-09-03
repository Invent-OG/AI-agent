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

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  duration: text('duration'),
  level: text('level').notNull().default('beginner'), // beginner, intermediate, advanced
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const courseModules = pgTable('course_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url'),
  duration: text('duration'),
  orderIndex: integer('order_index').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const studentProgress = pgTable('student_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').references(() => leads.id).notNull(),
  moduleId: uuid('module_id').references(() => courseModules.id).notNull(),
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  watchTime: integer('watch_time').default(0), // in seconds
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const forumPosts = pgTable('forum_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').references(() => leads.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull().default('general'), // general, technical, showcase
  isResolved: boolean('is_resolved').default(false),
  upvotes: integer('upvotes').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const forumReplies = pgTable('forum_replies', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => forumPosts.id).notNull(),
  leadId: uuid('lead_id').references(() => leads.id).notNull(),
  content: text('content').notNull(),
  upvotes: integer('upvotes').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const certificates = pgTable('certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').references(() => leads.id).notNull(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  certificateUrl: text('certificate_url'),
  certificateNumber: text('certificate_number').notNull(),
  studentName: text('student_name').notNull(),
  courseName: text('course_name').notNull(),
  completionDate: timestamp('completion_date').notNull(),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
})

export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(), // page_view, form_submit, payment_success, etc.
  eventData: text('event_data'), // JSON string for additional data
  userId: uuid('user_id'),
  sessionId: text('session_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  country: text('country'),
  city: text('city'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => leads.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'), // info, success, warning, error
  isRead: boolean('is_read').default(false),
  actionUrl: text('action_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})