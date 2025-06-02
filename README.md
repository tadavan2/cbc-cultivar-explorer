# CBC Cultivar Explorer 🍓

A modern, responsive web application for exploring strawberry cultivars from Commercial Berry Cultivars (CBC). This app showcases various strawberry varieties with detailed information about their traits, performance metrics, and growing characteristics.

## Features

- **Interactive Cultivar Browser**: Browse through 10 different strawberry varieties
- **Advanced Filtering**: Filter by growing type, flower type, traits, and certifications
- **Detailed Performance Metrics**: View yield, sugar content (Brix), shelf life, and fruit weight
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and transitions

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React useState hooks
- **Icons**: Emoji-based iconography for visual appeal

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
│   ├── page.tsx              # Main application layout
│   └── globals.css           # Global styles
├── components/
│   ├── TopNav.tsx              # Navigation header
│   ├── CultivarDetailCardV2.tsx# Rich marketing layout (primary view)
│   ├── CultivarChart.tsx       # Performance comparison charts
│   ├── SpiderChart.tsx         # Trait radar charts
│   ├── CultivarSelector.tsx    # Chart cultivar selection
│   └── CultivarFilterPanel.tsx # Filter controls
├── data/
│   └── cultivars.ts          # Mock cultivar data
├── types/
│   └── cultivar.ts           # TypeScript interfaces
└── public/
    └── images/               # Placeholder images
```

## Cultivar Data

The app includes 10 realistic strawberry cultivars with the following information:

- **Basic Info**: Name, emoji, type (Day-Neutral/Short-Day), flower type
- **Performance Stats**: Yield (kg/ha), Brix level, shelf life, fruit weight
- **Traits**: Disease resistance, climate adaptation, fruit characteristics
- **Certifications**: Organic, USDA certifications where applicable

### Featured Cultivars

1. **Albion** 🍓 - Premium day-neutral variety
2. **Monterey** 🌟 - Large, sweet berries with disease resistance
3. **Chandler** 🏆 - Gold standard for strawberry flavor
4. **Seascape** 🌊 - Coastal-adapted variety
5. **Camarosa** 💎 - Early-season commercial variety
6. **Festival** 🎉 - Heat-tolerant and aromatic
7. **Portola** 🔥 - High-yield heat-tolerant variety
8. **San Andreas** ⛰️ - Cold-hardy mountain variety
9. **Ruby June** 💍 - Boutique premium variety
10. **Fronteras** 🚀 - Next-generation climate-resilient cultivar

## Responsive Design

The application adapts to different screen sizes:

- **Desktop (1024px+)**: Three-column layout with list, detail, and filter panels
- **Tablet (768px-1023px)**: Collapsible panels with toggle navigation
- **Mobile (<768px)**: Single-panel view with navigation tabs

## Deployment

This app is designed to be deployed to Netlify or Vercel and can be accessed via `cbcberry.com/cultivars`.

### Build for Production

```bash
npm run build
npm start
```

## Future Enhancements

- Real image integration
- API integration for dynamic data
- Advanced search functionality
- Comparison tool for multiple cultivars
- Export functionality for selected cultivars
- User favorites and notes

## Contributing

This project was built for Commercial Berry Cultivars (CBC) as a showcase application for their strawberry varieties.

## License

Proprietary - Commercial Berry Cultivars (CBC)
