# NovaCare

## Overview

NovaCare is a decentralized level income platform built on blockchain technology. It's a Web3 application that allows users to connect their cryptocurrency wallets, join a network, and earn level-based income through smart contracts on the Binance Smart Chain (BSC). The platform features a multi-level rewards system with 8 progression tiers (Starter through Master), each requiring increasing BNB deposits.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for development and production
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom theme configuration supporting light/dark modes
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Typography**: Inter (body text) and Sora (display headings) from Google Fonts

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Feature components in `client/src/components/`
- Custom hooks in `client/src/hooks/`
- Utility libraries in `client/src/lib/`

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Build Process**: esbuild for production bundling with dependency allowlisting for cold start optimization
- **API Pattern**: RESTful endpoints prefixed with `/api`

The server follows a modular structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route registration
- `server/storage.ts` - Data storage interface (currently in-memory)
- `server/vite.ts` - Vite dev server integration for HMR

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` using Zod for validation
- **Migrations**: Managed via drizzle-kit (`db:push` command)

The schema defines level income structures, user statistics, and activity tracking with type-safe validation using Zod schemas that are shared between frontend and backend.

### Web3 Integration
- **Wallet Connection**: Custom React context (`WalletProvider`) for MetaMask integration
- **Chain**: Binance Smart Chain (BSC)
- **Contract Address**: `0x5b92a5e01419e8aaf44fcd80345a360D30c9B811`
- **Features**: Account connection, chain detection, and account change listeners

### Design System
The application follows Web3 premium design principles inspired by Uniswap, Rainbow Wallet, and Stripe:
- Glassmorphic navigation with backdrop blur
- Gradient accents (purple-to-blue primary theme)
- Elevated cards with subtle borders
- Progress indicators and level badges
- Light/dark mode support with CSS custom properties

## External Dependencies

### Blockchain Services
- **BSCScan**: Smart contract verification and transaction viewing
- **MetaMask**: Primary wallet provider for user authentication and transactions

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Database access and schema management

### UI Component Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component collection
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel functionality
- **Recharts**: Data visualization

### Development Tools
- **Vite**: Development server with HMR
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **TypeScript**: Type checking across the full stack