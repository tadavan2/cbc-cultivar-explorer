# CBC Cultivar Explorer 🍓

A modern, responsive web application for exploring strawberry cultivars from Commercial Berry Cultivars (CBC). This app showcases various strawberry varieties with detailed information about their traits, performance metrics, and growing characteristics.

## Features

- **Interactive Cultivar Browser**: Browse through multiple strawberry varieties with detailed information
- **Advanced Filtering**: Filter by flower type (Day-Neutral/Short-Day), market type, and traits
- **Detailed Performance Metrics**: View yield, sugar content (Brix), shelf life, and fruit weight
- **Comparison Charts**: Compare cultivars side-by-side with interactive charts and radar plots
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices with adaptive layouts
- **Multi-language Support**: Available in English, Spanish, and Portuguese
- **Modern UI**: Clean, professional interface with glassmorphism design, smooth animations, and transitions
- **Image Carousels**: Auto-rotating image galleries for each cultivar
- **Contact Forms**: Integrated inquiry forms for cultivar information requests

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Custom CSS (glassmorphism theme system)
- **State Management**: React hooks (useState, useEffect, useContext)
- **Charts**: Recharts library for data visualization
- **Icons**: Custom PNG icons with multi-language support
- **Deployment**: Vercel (automatic deployments from Git)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cbc-cultivar-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
cbc-cultivar-explorer/
├── app/
│   ├── page.tsx              # Main application layout and routing
│   ├── layout.tsx            # Root layout with providers
│   ├── globals.css           # Global styles and glassmorphism theme
│   ├── cultivar-themes.css   # Cultivar-specific theme colors
│   └── api/
│       └── contact/          # Contact form API endpoint
├── components/
│   ├── TopNav.tsx              # Navigation header with language switcher
│   ├── Homepage.tsx            # Welcome/intro page
│   ├── CultivarDetailCardV2.tsx # Rich marketing layout (primary view)
│   ├── CultivarIcon.tsx        # Reusable cultivar icon component
│   ├── CultivarChart.tsx       # Performance comparison charts
│   ├── SpiderChart.tsx         # Trait radar charts
│   ├── CultivarSelector.tsx    # Chart cultivar selection
│   ├── CultivarFilterPanel.tsx # Filter controls
│   ├── ImageCarousel.tsx       # Auto-rotating image gallery
│   ├── ContactForm.tsx         # Inquiry form component
│   ├── InfoOverlayMobile.tsx   # Mobile info overlay
│   └── LanguageContext.tsx     # i18n context and translations
├── data/
│   ├── cultivars.ts          # Cultivar data definitions
│   ├── cultivarContent.ts    # Cultivar-specific content (descriptions, images)
│   ├── chartData.ts          # Chart data and comparison logic
│   ├── infoOverlayContent.ts # Info overlay content and button configs
│   ├── csvParser.ts          # CSV data parser for charts
│   └── i18n/                 # Translation files (en, es, pt)
├── types/
│   └── cultivar.ts           # TypeScript interfaces
├── public/
│   └── images/               # Static images (icons, backgrounds, cultivar photos)
└── docs/                     # Documentation files
```

## Cultivar Data

The app includes multiple strawberry cultivars with the following information:

- **Basic Info**: Name, emoji, type (Day-Neutral/Short-Day), flower type
- **Performance Stats**: Yield (kg/ha), Brix level, shelf life, fruit weight
- **Traits**: Disease resistance, climate adaptation, fruit characteristics
- **Certifications**: Organic, USDA certifications where applicable
- **Images**: Marketing banners and photo galleries
- **Content**: Detailed descriptions and marketing copy

## Responsive Design

The application adapts to different screen sizes:

- **Desktop (≥740px)**: Full layout with dockable filter panel, horizontal cultivar cards, detailed charts
- **Tablet (740px-1023px)**: Adaptive layout with collapsible panels
- **Mobile (<740px)**: Single-panel view with bottom drawer for cultivar selection, vertical layouts

## Deployment

This app is designed to be deployed to Vercel and can be accessed via `cbcberry.com/cultivars`.

### Build for Production

```bash
npm run build
npm start
```

### Vercel Deployment

The app automatically deploys from the Git repository. Configure the production branch in Vercel dashboard settings.

## Documentation

- **Documentation Index**: `docs/INDEX.md` - Master index of all documentation
- **Code Structure Guide**: `docs/CODE_STRUCTURE.md` - File-by-file guide for AI-assisted development
- **Architecture Guide**: `data/README_ArchitectureGuide.md` - Comprehensive architecture documentation
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md` - Deployment procedures and update workflows
- **Chart System**: `data/README_ChartSystem.md` - Chart system documentation
- **Info Overlay System**: `data/README_InfoOverlaySystem.md` - Info overlay system documentation
- **CSS Theme System**: `docs/CSS_THEME_SYSTEM.md` - CSS architecture and theme system documentation
- **Theme Extraction Guide**: `docs/THEME_EXTRACTION_GUIDE.md` - Guide for extracting shared theme to homepage app

## Recent Updates (2025)

- **Code Cleanup**: Removed duplicate CSS classes, dead code, and unused animations
- **Component Simplification**: Extracted reusable components, simplified helper functions
- **Theme System**: Centralized CSS variables for easier color management
- **Documentation**: Comprehensive guides added for maintenance and future development
- **Shared Theme**: Extracted reusable theme system to `shared/theme/` for homepage app integration

## Contributing

This project was built for Commercial Berry Cultivars (CBC) as a showcase application for their strawberry varieties.

## License

Proprietary - Commercial Berry Cultivars (CBC)
