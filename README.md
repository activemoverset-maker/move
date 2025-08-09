# Active Movers & Packers

A modern Next.js 14+ website for Active Movers & Packers, a professional moving and packing service based in Addis Ababa, Ethiopia.

## Features

- **Modern Design**: Clean, professional design with green and black theme
- **Bilingual Support**: English and Amharic language support
- **Responsive**: Mobile-first responsive design
- **Interactive Calendar**: Booking system with calendar integration
- **Blog System**: Content management with rich media support
- **Admin Dashboard**: Comprehensive admin panel
- **Analytics**: Google Analytics and Vercel Analytics integration
- **Contact Integration**: Telegram bot notifications
- **SEO Optimized**: Meta tags, Open Graph, and structured data

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **UI Components**: ShadCN/UI
- **Animations**: Framer Motion, GSAP
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Forms**: React Hook Form + Zod
- **Internationalization**: Custom i18n solution
- **Analytics**: Google Analytics, Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd activemovers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://your-username:your-password@your-host:5432/your-database"

   # JWT Secret for Admin Authentication
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
   TELEGRAM_CHAT_ID="your-telegram-chat-id"

   # Admin Configuration
   ADMIN_EMAIL="admin@activemovers.com"
   ADMIN_PASSWORD="admin123"
   ADMIN_NAME="Admin"

   # Contact Information
   PHONE_NUMBER="+251982270000"
   WHATSAPP_NUMBER="+251982270000"
   TELEGRAM_USERNAME="activemovers"

   # Site Configuration
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_SITE_NAME="Active Movers & Packers"

   # Google Analytics
   NEXT_PUBLIC_GA_ID="your-google-analytics-id"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx scripts/seed-calendar.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
activemovers/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── blog/              # Blog pages
│   ├── booking/           # Booking page
│   ├── services/          # Service pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # ShadCN/UI components
│   ├── sections/         # Page sections
│   ├── pages/            # Page components
│   ├── admin/            # Admin components
│   ├── calendar/         # Calendar components
│   └── animations/       # Animation components
├── lib/                  # Utility functions
├── constants/            # Site constants
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── prisma/               # Database schema
├── scripts/              # Database scripts
└── types/                # TypeScript types
```

## Key Features

### 🏠 Homepage
- Hero section with 3D truck animation
- Services overview
- Calendar integration
- TikTok videos section
- Testimonials
- Call-to-action sections

### 📝 Blog System
- Blog list with search and filtering
- Individual blog posts
- Rich media support (images, YouTube, TikTok)
- Admin interface for content management
- Bilingual support

### 📅 Calendar & Booking
- Interactive calendar for availability
- Booking system with form
- Admin calendar management
- Real-time slot updates

### 👨‍💼 Admin Dashboard
- Modern, responsive design
- Quick actions for common tasks
- Statistics and analytics
- Content management
- Calendar management

### 🌐 Internationalization
- English and Amharic support
- Language switcher
- Context-based translations
- SEO-friendly URLs

### 📱 Mobile Responsive
- Mobile-first design
- Touch-friendly interfaces
- Optimized for all screen sizes
- Fast loading times

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run setup-admin` - Set up admin user

## Environment Variables

### Required
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_CHAT_ID` - Telegram chat ID for notifications

### Optional
- `PHONE_NUMBER` - Contact phone number
- `WHATSAPP_NUMBER` - WhatsApp number
- `TELEGRAM_USERNAME` - Telegram username
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_SITE_URL` - Site URL
- `NEXT_PUBLIC_SITE_NAME` - Site name

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email admin@activemovers.com or call +251982270000. 
 