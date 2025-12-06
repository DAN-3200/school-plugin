# Design Guidelines: SEI - Sistema de Engajamento e Intervenção Educacional

## Design Approach
**Selected Framework**: Material Design principles adapted for educational data dashboards
**Rationale**: This is a data-intensive educational tool requiring clarity, hierarchy, and efficient information processing. Material Design provides robust patterns for tables, cards, and status indicators.

## Core Design Principles
1. **Data Clarity First**: Information hierarchy over visual decoration
2. **Status-Driven Color**: Risk levels (verde/amarelo/vermelho) must be immediately recognizable
3. **Role-Based Interfaces**: Distinct visual treatment for Student vs Teacher dashboards
4. **Scannable Information**: Dense data must be easily digestible at a glance

## Typography System
- **Primary Font**: Inter or Roboto (Google Fonts)
- **Display/Headers**: font-bold text-2xl to text-4xl
- **Body Text**: text-sm to text-base, font-normal
- **Data/Metrics**: font-semibold for numbers, font-mono for scores
- **Labels**: text-xs uppercase tracking-wide text-gray-600

## Layout & Spacing System
**Tailwind Units**: Use 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4 to gap-6
- Page margins: max-w-7xl mx-auto px-4

## Component Library

### Navigation & Layout
**Teacher Dashboard Layout**:
- Sidebar navigation (w-64) with student list, intervenções, relatórios
- Main content area with breadcrumbs and page title
- Top bar with user profile and notifications

**Student Interface**:
- Simplified top navigation with profile and logout
- Centered content cards (max-w-3xl)

### Data Display Components

**Risk Indicator Badge**:
- Pill-shaped badges with background opacity
- Verde (Baixo): bg-green-100 text-green-800 border-green-300
- Amarelo (Médio): bg-yellow-100 text-yellow-800 border-yellow-300
- Vermelho (Alto): bg-red-100 text-red-800 border-red-300
- Size: px-3 py-1 rounded-full text-sm font-medium

**Student Data Table**:
- Zebra striping for row alternation
- Sticky header row
- Columns: Nome, IRE Badge, Notas, Presença, Participação AVA, Ações
- Hover state on rows for interactivity
- Click row to expand detailed view

**Metric Cards**:
- White cards with subtle shadow (shadow-sm)
- Icon + label + large number display
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Example: Total Alunos, Risco Alto, Intervenções Ativas, Check-ins Pendentes

### Forms & Interactions

**Check-in Socioemocional Form**:
- Card-based layout with question sections
- Slider inputs (0-10) with visual feedback showing current value
- Labels clearly stating question (Motivação, Estresse, Foco, Organização)
- Submit button: large, primary color, bottom of form

**Intervention Creation Modal**:
- Overlay modal (max-w-2xl)
- Form fields: Objetivo (textarea), Ações Planejadas (textarea), Data Início (date picker), Responsáveis (dropdown)
- Primary action: "Criar Intervenção" (bold, prominent)
- Secondary action: "Cancelar" (outlined)

**Progress Tracking Component**:
- Timeline-style vertical list showing intervention checkpoints
- Each entry: date + observações + progress bar (0-10)
- "Adicionar Acompanhamento" button at bottom

### Visualization Elements

**Progress Bars**:
- Height: h-2 rounded-full
- Background: bg-gray-200
- Fill color based on value (green for good progress, yellow/red for concern)

**Trend Charts** (for socioemocional histórico):
- Simple line charts showing 4-6 week trends
- One line per metric (Motivação, Estresse, Foco, Organização)
- Color-coded lines with legend
- Grid background for easier reading

### Status & Feedback

**Empty States**:
- Centered icon + message + action button
- Example: "Nenhum check-in realizado ainda. Complete seu primeiro check-in agora."

**Success Messages**:
- Toast notifications top-right
- Auto-dismiss after 3 seconds
- Green background for success, blue for info

## Multi-Column Strategy
- **Dashboard Overview**: 4-column metric cards (desktop), stack on mobile
- **Student List**: Single full-width table, no columns
- **Intervention Form**: 2-column layout for form fields where logical
- **Check-in History**: 2-column grid showing cards (desktop)

## Images
**No hero images needed** - this is a functional dashboard application. Focus on:
- User avatar placeholders in navigation
- Empty state illustrations (optional, simple line art)
- Icon library: Heroicons for all UI icons

## Page-Specific Guidelines

### Login Page
- Centered card (max-w-md) on neutral background
- Logo/title at top
- Radio buttons for role selection (Aluno / Professor)
- Username/password fields (simplified mock)
- Single primary action button

### Dashboard Professor
- Sidebar + main content layout
- Top section: 4 metric cards showing aggregate data
- Middle section: Filterable student table with IRE indicators
- Each student row expandable to show detailed metrics and quick actions

### Check-in Aluno
- Clean, focused interface
- Progress indicator showing week number
- 4 questions vertically stacked with slider inputs
- Previous responses shown as timeline below form

### Intervenções Page
- Tab navigation: "Abertas" / "Concluídas"
- Card grid showing intervention summaries
- Click card to expand full detail with timeline of acompanhamentos
- Floating action button for "Nova Intervenção"

## Accessibility & Quality
- All form inputs must have visible labels
- Risk indicators must have text labels, not color-only
- Keyboard navigation for all interactive elements
- Focus states clearly visible on all inputs and buttons