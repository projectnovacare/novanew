# NovaCare Design Guidelines

## Design Approach
**Reference-Based: Web3 Premium** - Drawing inspiration from Uniswap's clean data displays + Rainbow Wallet's approachable crypto UX + Stripe's trust-building clarity. Focus on transparency, clarity, and modern professionalism suitable for a financial/income platform.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - Clean, technical, excellent for numbers/data
- **Display Font**: Sora (Google Fonts) - Modern, slightly geometric for headings
- **Hierarchy**:
  - Hero/H1: Sora, 48px (mobile: 32px), bold
  - H2 Sections: Sora, 36px (mobile: 24px), semibold
  - H3 Cards: Inter, 20px, semibold
  - Body: Inter, 16px, regular
  - Data/Numbers: Inter, 24px, medium (tabular-nums)
  - Labels: Inter, 14px, medium, uppercase tracking-wide

### Layout System
**Tailwind Spacing**: Use units of 4, 6, 8, 12, 16, 24 for consistency
- Container: max-w-7xl with px-6
- Section padding: py-16 (mobile: py-12)
- Card padding: p-6 to p-8
- Grid gaps: gap-6 for cards, gap-4 for list items

## Component Library

### Navigation
Sticky header with glassmorphic background (backdrop-blur-lg), NovaCare logo left, Wallet Connect button right (rounded-full with gradient), navigation links center (mobile: hamburger menu)

### Dashboard Cards
Elevated cards with subtle border, rounded-2xl corners:
- **Level Income Card**: Large featured card showing total earnings, current level badge, progress bar to next level
- **Statistics Grid**: 3-column grid (mobile: 1-column) - Total Members, Active Referrals, Pending Rewards
- **Recent Activity**: Transaction list with timestamp, amount, status badges

### Data Visualization
- Progress bars: rounded-full, gradient fills, percentage labels
- Level badges: Circular with level number, gradient background, subtle shadow
- Status indicators: Small rounded pills (green: active, yellow: pending, gray: completed)

### Buttons & CTAs
- Primary: Gradient background (purple-to-blue), rounded-lg, bold text, shadow-lg
- Secondary: Border-2 with gradient border, transparent background
- Connect Wallet: Rounded-full, gradient, with wallet icon from Heroicons

### Forms & Inputs
Minimal outlined inputs with focus:ring-2 effect, rounded-lg, placeholder text in gray-400, labels above inputs

## Logo Concept
**NovaCare Logo**: Modern geometric mark combining:
- Stylized "N" formed by overlapping hexagons (representing network/blockchain structure)
- Gradient from deep purple (#7C3AED) to cyan blue (#06B6D4)
- Wordmark "NovaCare" in Sora font, bold weight
- Clean, scalable SVG format

## Images & Visuals

### Hero Section
**Large Hero Image**: Abstract 3D gradient mesh background (purple/blue/cyan tones) suggesting network connectivity and modern technology. Overlay with semi-transparent gradient for text readability.

### Supporting Visuals
- Abstract geometric patterns in section backgrounds (subtle, low opacity)
- Iconography from Heroicons for all interface icons
- No stock photos - keep it digital/abstract/modern

## Key Sections

### Hero
Full-viewport hero with gradient mesh background, centered content:
- H1: "Empower Your Network with NovaCare"
- Subheading explaining level-based income system
- Primary CTA: "Connect Wallet" + Secondary: "View Contract"
- Trust indicators below: Contract address (truncated with copy), verified badge

### Dashboard (Post-Connect)
2-column layout (mobile: stacked):
- Left: Large Level Income card with detailed breakdown
- Right: Stats grid + Recent activity feed
- Bottom: Referral link section with copy button

### How It Works
3-step visual flow with numbered cards:
1. Connect Wallet
2. Join Network
3. Earn Level Income
Icons + brief descriptions, connected with dotted lines

### Footer
Compact 2-column: Logo + tagline left, Contract details + social links right

## Animation Strategy
Minimal, purposeful animations:
- Card hover: subtle lift (transform translateY(-2px))
- Button hover: slight scale (1.02)
- Number counters: Animate on view for earnings display
- Smooth transitions: 200-300ms ease-in-out

**No complex scroll animations** - keep performance crisp for data-heavy interface.