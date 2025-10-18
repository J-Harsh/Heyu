# HeyU - Technical Interview Platform

HeyU is a comprehensive video interview platform designed for technical hiring. It combines HD video conferencing with an integrated code editor to create seamless technical interview experiences.

## 🚀 Features

- **HD Video Interviews** - Crystal-clear video quality powered by Stream.io
- **Live Code Editor** - Built-in Monaco editor for real-time collaborative coding
- **Smart Scheduling** - Automated reminders and calendar integrations
- **Multi-Role Support** - Separate experiences for candidates and interviewers
- **Real-time Analytics** - Track interview performance and team metrics
- **Instant Notifications** - Stay updated with real-time alerts
- **Secure & Scalable** - Enterprise-grade security with Clerk authentication

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Clerk
- **Database**: Convex
- **Video**: Stream.io Video SDK
- **Code Editor**: Monaco Editor
- **UI Components**: Radix UI, shadcn/ui

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd heyu
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (landing)/         # Landing page components
│   └── (root)/            # Authenticated app pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── global/           # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## 🎯 Key Components

- **Meeting Room** - Video conferencing with integrated code editor
- **Dashboard** - Interview management and analytics
- **Scheduling** - Calendar integration and time slot management
- **Recordings** - Access to past interview sessions
- **Code Submissions** - Track and review candidate code

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Editor Features

- Support for 50+ programming languages
- Syntax highlighting and IntelliSense
- Real-time collaboration
- Code execution and testing
- Multiple language templates

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

## 📱 Supported Languages

- JavaScript/TypeScript
- Python
- Java
- Go
- C++
- C#

## 🔒 Security

- End-to-end encrypted video streams
- Clerk authentication with industry-standard encryption
- GDPR and SOC 2 compliant
- Secure data storage with Convex

## 📊 Analytics

- Real-time interview metrics
- Candidate performance tracking
- Team productivity insights
- Custom reporting dashboards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
