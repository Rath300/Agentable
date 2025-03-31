# NoCode AI Agent

A powerful no-code platform for building AI-powered workflows.

## Features

- Drag-and-drop workflow builder
- Node-based visual programming
- Real-time workflow validation
- Undo/redo functionality
- Workflow templates
- Google OAuth authentication
- PostgreSQL database integration

## Prerequisites

- Node.js 18 or later
- npm or yarn
- PostgreSQL database
- Google Cloud account (for OAuth)
- Vercel account (for deployment)
- Railway account (for database hosting)

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nocode-ai-agent.git
   cd nocode-ai-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### 1. Database Setup (Railway)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Create new project:
   ```bash
   railway init
   ```

4. Add PostgreSQL database:
   ```bash
   railway add postgresql
   ```

5. Get database URL:
   ```bash
   railway variables get DATABASE_URL
   ```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.vercel.app/api/auth/callback/google
   ```

### 3. Frontend Deployment (Vercel)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Configure environment variables in Vercel dashboard:
   ```
   DATABASE_URL="your-railway-postgresql-url"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-nextauth-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

### 4. Database Migration

1. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Project Structure

```
nocode-ai-agent/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── store/           # State management
│   └── types/           # TypeScript types
├── prisma/              # Database schema
├── public/              # Static assets
└── package.json         # Dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
