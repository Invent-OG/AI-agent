# AutomateFlow - Modern Landing Page + Admin Panel

A comprehensive web application built with Next.js, Supabase, and Drizzle ORM for selling automation courses with integrated payment processing and admin management.

## 🚀 Features

### Landing Page
- **Hero Section**: Compelling headline with AI agent automation theme
- **Course Modules**: Detailed breakdown of automation training content
- **Pricing Plans**: Tiered pricing with early-bird discounts
- **Testimonials**: Social proof from successful students
- **FAQ Section**: Comprehensive answers to common questions
- **Lead Capture Forms**: For course enrollment and free audits
- **Integrations Showcase**: Display of supported automation tools
- **Countdown Timer**: Creates urgency for limited-time offers
- **Sticky CTA**: Persistent call-to-action for better conversion
- **Theme Toggle**: Dark/light mode support
- **Responsive Design**: Mobile-first approach with smooth animations

### Admin Panel
- **Dashboard Stats**: Total leads, conversions, revenue tracking
- **Leads Management**: Filter, search, and export lead data
- **Analytics Charts**: Visual representation of signup trends
- **Payment Tracking**: Monitor successful transactions
- **Email Management**: Resend welcome emails to leads
- **CSV Export**: Download lead data for external analysis

### Backend Features
- **Supabase Integration**: Secure database with Row Level Security
- **Drizzle ORM**: Type-safe database operations
- **TanStack Query**: Efficient data fetching and caching
- **Cashfree Payments**: Secure payment processing
- **Webhook Handling**: Process payment confirmations
- **Lead Status Tracking**: new → registered → paid workflow

## 🛠 Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Styling**: TailwindCSS, ShadCN UI components
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM with migrations
- **API**: Next.js API routes
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Payments**: Cashfree integration
- **Theme**: Next-themes for dark mode

## 🏗 Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── admin/            # Admin components
│   ├── landing/          # Landing page components
│   └── ui/              # Reusable UI components
├── lib/
│   ├── db/              # Database schema and config
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
├── providers/           # React providers
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Cashfree merchant account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd automateflow
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- Supabase credentials
- Cashfree API keys
- Email service credentials

4. **Set up database**
```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
```

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📊 Database Schema

### Tables
- **users**: User authentication and roles
- **leads**: Lead information and status tracking  
- **payments**: Payment records with Cashfree integration
- **referrals**: Referral code management

### Lead Workflow
1. **new**: Lead submits form
2. **registered**: Lead clicks enrollment
3. **paid**: Payment completed successfully

## 💳 Payment Integration

The app integrates with Cashfree for secure payment processing:

1. Lead submits enrollment form
2. Payment order created via Cashfree API
3. User redirected to Cashfree payment page
4. Webhook updates payment status
5. Lead status updated to 'paid'
6. Confirmation email/WhatsApp sent

## 📈 Analytics & Admin Features

- **Real-time Dashboard**: Monitor key metrics
- **Lead Management**: Search, filter, and export capabilities
- **Conversion Tracking**: Visualize signup to payment funnel
- **Revenue Analytics**: Track daily/monthly revenue
- **Email Automation**: Resend welcome emails
- **CSV Export**: Download lead data

## 🎨 Design Features

- **Glassmorphism Effects**: Modern visual style
- **Gradient Backgrounds**: Eye-catching color schemes
- **Micro-interactions**: Smooth hover states and transitions
- **Mobile-first**: Responsive design for all devices
- **Apple-level Polish**: Attention to detail in UX/UI
- **Performance Optimized**: Fast loading with Next.js optimizations

## 🔐 Security Features

- **Row Level Security**: Supabase RLS policies
- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Zod schema validation
- **Secure Payments**: PCI-compliant Cashfree integration
- **Environment Variables**: Sensitive data protection

## 📧 Email & Communication

- **Welcome Emails**: Automated onboarding flow
- **Payment Confirmations**: Transaction receipts
- **WhatsApp Integration**: Optional WhatsApp notifications
- **Admin Notifications**: New lead alerts

## 🚀 Deployment

The application is configured for easy deployment:

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Vercel/Netlify**
- Connect your Git repository
- Set environment variables
- Deploy automatically

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support or questions about this project:
- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ for modern SaaS businesses looking to sell automation courses effectively.**