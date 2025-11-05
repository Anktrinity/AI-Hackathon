# AI Task Manager SaaS - Design Guidelines

## Design Approach
**System-Based with Modern SaaS References**: Drawing from Linear's precision, Vercel's sophistication, and shadcn/ui's component philosophy. This hackathon task manager balances utility with visual polish—professional enough for enterprise adoption while maintaining startup energy.

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (default interface):
- Background: 222 47% 11% (deep charcoal base)
- Surface: 224 71% 4% (elevated cards/panels)
- Border: 216 34% 17% (subtle separation)
- Text Primary: 213 31% 91%
- Text Secondary: 215 20% 65%

**Accent Colors**:
- Primary Brand: 262 83% 58% (vibrant purple for CTAs, active states)
- Success: 142 71% 45% (task completion, positive states)
- Warning: 38 92% 50% (notification urgency indicators)
- Destructive: 0 72% 51% (critical alerts, delete actions)

**Light Mode Adaptation**:
- Background: 0 0% 100%
- Surface: 240 10% 96%
- Border: 240 6% 90%
- Text Primary: 222 47% 11%

### B. Typography

**Font System**:
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for task IDs, timestamps)

**Type Scale**:
- Display: text-4xl/text-5xl font-bold tracking-tight
- Heading 1: text-3xl font-semibold
- Heading 2: text-2xl font-semibold
- Heading 3: text-xl font-medium
- Body: text-base font-normal
- Small: text-sm
- Micro: text-xs text-muted-foreground

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16 for consistency (p-4, gap-8, space-y-12)

**Grid Architecture**:
- Dashboard: Sidebar (280px fixed) + Main content (flex-1) + Optional right panel (320px)
- Content max-width: max-w-7xl mx-auto
- Card spacing: gap-6 between major sections, gap-4 within components

### D. Component Library

**Notification Banner System** (Critical Feature):
- **Position**: Fixed top, below nav (z-40), full-width with max-w-7xl container
- **Variants**:
  - Info: Blue-violet gradient border-l-4, purple accent
  - Success: Green border-l-4, emerald accent
  - Warning: Amber border-l-4, yellow accent  
  - Critical: Red border-l-4, destructive accent
- **Structure**: Icon (Heroicons) + Title (font-medium) + Description (text-sm) + CTA Button + Dismiss X
- **Behavior**: Slide-in from top (150ms), stacked if multiple (gap-2), auto-dismiss optional (5-8s)
- **Backdrop**: bg-background/95 backdrop-blur-md for depth

**Navigation**:
- Top bar: Glass effect (bg-background/80 backdrop-blur-md), sticky, includes workspace switcher + user menu
- Sidebar: Collapsible, icon-only mobile, full desktop, active state with purple accent bar

**Cards & Surfaces**:
- Task cards: border rounded-lg bg-card p-6, hover:border-primary/50 transition
- Elevated panels: shadow-lg for modals/popovers
- Dashboard widgets: Subtle border, no heavy shadows

**Forms & Inputs**:
- shadcn/ui default styling maintained
- Focus rings: ring-2 ring-primary ring-offset-2
- Dark inputs: bg-background border-input

**Buttons**:
- Primary: bg-primary text-primary-foreground (purple fill)
- Secondary: border-input bg-background (outline)
- Ghost: hover:bg-accent (minimal)
- On images: variant="outline" with backdrop-blur-sm bg-background/10

**Data Displays**:
- Tables: Striped rows, compact density, sticky headers
- Task lists: Checkbox + Priority indicator + Title + Assignee avatar + Due date
- Progress bars: Rounded-full with gradient fills

### E. Animations

Use sparingly for polish, not decoration:
- Page transitions: Crossfade (200ms)
- Notification entry: translateY + opacity (150ms ease-out)
- Button interactions: Scale micro-interactions (100ms)
- Task completion: Subtle checkmark animation + strikethrough

## Images

**Hero Section**: 
Full-width gradient mesh background (purple-to-blue abstract) overlaid with frosted glass cards showcasing the dashboard interface. Position: Top of landing page, 85vh height. Alternative: Screenshot of actual dashboard interface with subtle shadow overlay for depth.

**Feature Showcases**:
- Screenshot 1: Notification banner system in action (multiple stacked examples)
- Screenshot 2: Task board with drag-and-drop visual
- Screenshot 3: Team collaboration view with avatars/activity
- Position these in 2-column grid within features section

**Dashboard Placeholders**:
- User avatars: Use gradient circles with initials as fallback
- Empty states: Illustration placeholders (mention "CUSTOM ILLUSTRATION: [description]")

## Key Patterns

**Dashboard Layout**: Left sidebar (nav) + Center content (tasks/boards) + Right activity panel (notifications feed, recent updates)

**Hackathon-Specific Elements**:
- Countdown timers with monospace font
- Team member capacity indicators (visual load bars)
- Milestone checklist with progress rings
- Real-time activity pulse indicators (subtle green dots)

**Responsive Strategy**:
- Desktop: Three-panel layout
- Tablet: Collapsible sidebar, no right panel
- Mobile: Bottom nav, full-width content, slide-out panels

**Critical UX Decisions**:
- Notifications stack vertically, newest on top, max 3 visible
- Primary actions always purple, secondary always outline
- Task priority: Color-coded dots (red/amber/blue) not labels
- Dark mode default, light mode available via toggle