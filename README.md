# DUCSU Voter Management System

A complete enterprise-grade voter management system for Dhaka University Central Students' Union (DUCSU) with 39,789 voters across 18 halls.

## Features

- **39,789 Voters** - Complete voter database
- **18 Halls** - All residential halls integrated
- **Bilingual Support** - Bengali (বাংলা) and English
- **Authentication** - Role-based access control
- **Dark Mode** - Theme switching support
- **Command Palette** - Quick actions (⌘K/Ctrl+K)
- **Batch Operations** - Multi-select and export
- **Real-time Search** - Fast filtering and search
- **VEZRAN Powered** - Enhanced by VEZRAN Super Intelligence

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Framer Motion** - Animations

## Installation

```bash
cd ducsu-voter-system
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Authentication

- **Admin**: Username: `admin`, Password: `Subscribe@vezran`
- **User**: Username: `user`, Password: `follow@vezranai`

## Deployment

### Vercel

```bash
cd ducsu-voter-system
vercel
```

### Docker

```bash
docker build -t ducsu-system .
docker run -p 3000:3000 ducsu-system
```

## License

© 2024 DUCSU Voter Management System | Powered by VEZRAN