# Documentation Index - CBC Cultivar Explorer

This is the master index for all documentation in the CBC Cultivar Explorer project. Use this as a quick reference guide to find the information you need.

## 📚 Quick Reference

### For AI-Assisted Development
- **[CODE_STRUCTURE.md](./CODE_STRUCTURE.md)** - Comprehensive file-by-file guide with dependencies and relationships
- **[README.md](../README.md)** - Project overview and features
- **[data/README_ArchitectureGuide.md](../data/README_ArchitectureGuide.md)** - Complete architecture documentation

### For Deployment & Updates
- **[DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)** - Deployment procedures, Git commands, and update workflows

### For Styling & Theming
- **[CSS_THEME_SYSTEM.md](./CSS_THEME_SYSTEM.md)** - CSS architecture, theme system, and styling patterns

### For Specific Systems
- **[data/README_ChartSystem.md](../data/README_ChartSystem.md)** - Chart system documentation
- **[data/README_InfoOverlaySystem.md](../data/README_InfoOverlaySystem.md)** - Info overlay system documentation

---

## 📖 Documentation Files

### Main Documentation

#### `README.md`
**Location**: Root directory  
**Purpose**: Project overview, features, and quick start guide  
**Use When**: You need a high-level understanding of the project

**Key Sections:**
- Project description
- Features list
- Technology stack
- Quick start instructions

---

#### `DEPLOYMENT_GUIDE.md`
**Location**: Root directory  
**Purpose**: Deployment procedures and update workflows  
**Use When**: You need to deploy changes or update content

**Key Sections:**
- Quick reference commands
- Common update scenarios
- Testing procedures
- Git commands reference
- Troubleshooting

---

### Architecture Documentation

#### `data/README_ArchitectureGuide.md`
**Location**: `data/` directory  
**Purpose**: Complete architecture guide with detailed system explanations  
**Use When**: You need to understand how the application is structured

**Key Sections:**
- Global architecture overview
- Visual identity and design system
- View system architecture
- Folder structure
- Data architecture
- Filter panel system
- Icon/image system
- Chart system
- Comparison logic
- Info overlay system
- Step-by-step guide for adding new cultivars

---

#### `docs/CODE_STRUCTURE.md`
**Location**: `docs/` directory  
**Purpose**: File-by-file code structure guide for AI-assisted development  
**Use When**: You need to understand specific files, their purposes, and relationships

**Key Sections:**
- Application entry points
- Core components
- Data layer
- Styling system
- Type definitions
- API routes
- Public assets
- Import/export relationships
- Common patterns
- Design decisions

---

### System-Specific Documentation

#### `docs/CSS_THEME_SYSTEM.md`
**Location**: `docs/` directory  
**Purpose**: CSS architecture and theme system documentation  
**Use When**: You need to understand or modify styles, themes, or CSS structure

**Key Sections:**
- Core technologies (Tailwind CSS, custom CSS)
- File structure
- Styling hierarchy and conflicts
- Key CSS patterns (Glassmorphism, buttons, animations)
- Cultivar card theming
- Responsive design
- Maintenance considerations

---

#### `data/README_ChartSystem.md`
**Location**: `data/` directory  
**Purpose**: Chart system documentation  
**Use When**: You need to understand or modify chart functionality

**Key Sections:**
- Chart system overview
- Data-driven architecture
- CSV loading
- Supported metrics
- Chart component usage

---

#### `data/README_InfoOverlaySystem.md`
**Location**: `data/` directory  
**Purpose**: Info overlay system documentation  
**Use When**: You need to understand or modify info overlay functionality

**Key Sections:**
- Info overlay system overview
- Automatic button generation
- Content management
- Multi-language support

---

## 🎯 Common Tasks & Where to Find Help

### Adding a New Cultivar
1. **Start Here**: `data/README_ArchitectureGuide.md` - "Step-by-Step Guide for Adding New Cultivars"
2. **Data Structure**: `docs/CODE_STRUCTURE.md` - "Data Layer" section
3. **Content Files**: `docs/CODE_STRUCTURE.md` - "Public Assets" section

### Updating Styles or Themes
1. **Start Here**: `docs/CSS_THEME_SYSTEM.md` - Complete CSS documentation
2. **Theme Classes**: `app/cultivar-themes.css` - Theme definitions
3. **Global Styles**: `app/globals.css` - Base styles

### Understanding Component Structure
1. **Start Here**: `docs/CODE_STRUCTURE.md` - "Core Components" section
2. **File Headers**: Each component file has a comprehensive header comment
3. **Architecture**: `data/README_ArchitectureGuide.md` - "View System Architecture"

### Deploying Changes
1. **Start Here**: `DEPLOYMENT_GUIDE.md` - Complete deployment guide
2. **Git Commands**: `DEPLOYMENT_GUIDE.md` - "Git Commands Reference"
3. **Testing**: `DEPLOYMENT_GUIDE.md` - "Testing Before Deployment"

### Modifying Chart Data
1. **Start Here**: `data/README_ChartSystem.md` - Chart system documentation
2. **Data Loading**: `docs/CODE_STRUCTURE.md` - "data/chartData.ts" section
3. **CSV Format**: `docs/CODE_STRUCTURE.md` - "data/csvParser.ts" section

### Understanding Data Flow
1. **Start Here**: `docs/CODE_STRUCTURE.md` - "Import/Export Relationships"
2. **Architecture**: `data/README_ArchitectureGuide.md` - "Data Architecture"
3. **File Headers**: Check individual file headers for dependencies

---

## 🔍 File Structure Overview

```
cbc-cultivar-explorer/
├── README.md                          # Project overview
├── DEPLOYMENT_GUIDE.md                # Deployment procedures
├── docs/
│   ├── INDEX.md                       # This file
│   ├── CODE_STRUCTURE.md              # Code structure guide
│   └── CSS_THEME_SYSTEM.md            # CSS documentation
├── data/
│   ├── README_ArchitectureGuide.md    # Complete architecture guide
│   ├── README_ChartSystem.md          # Chart system docs
│   └── README_InfoOverlaySystem.md    # Info overlay docs
└── [code files with AI-friendly headers]
```

---

## 💡 Tips for AI-Assisted Development

1. **Start with File Headers**: All key files have comprehensive headers explaining their purpose, dependencies, and relationships
2. **Check CODE_STRUCTURE.md**: This is the most detailed guide for understanding file relationships
3. **Use Architecture Guide**: For high-level system understanding
4. **Reference CSS Docs**: When working with styles or themes
5. **Follow Deployment Guide**: For any deployment or update tasks

---

## 📝 Documentation Status

**Last Updated**: 2025 (Second Pass Refactoring)

**Documentation Completeness**:
- ✅ Project overview (README.md)
- ✅ Deployment guide (DEPLOYMENT_GUIDE.md)
- ✅ Architecture guide (data/README_ArchitectureGuide.md)
- ✅ Code structure guide (docs/CODE_STRUCTURE.md)
- ✅ CSS documentation (docs/CSS_THEME_SYSTEM.md)
- ✅ Chart system docs (data/README_ChartSystem.md)
- ✅ Info overlay docs (data/README_InfoOverlaySystem.md)
- ✅ AI-friendly file headers (all key files)

**Recent Updates**:
- Added comprehensive file headers to all key code files
- Created CODE_STRUCTURE.md for AI-assisted development
- Updated DEPLOYMENT_GUIDE.md with current structure
- Updated Architecture Guide with refactored components
- Created this master index

---

## 🔗 Quick Links

- [Project README](../README.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Code Structure Guide](./CODE_STRUCTURE.md)
- [CSS Theme System](./CSS_THEME_SYSTEM.md)
- [Architecture Guide](../data/README_ArchitectureGuide.md)
- [Chart System](../data/README_ChartSystem.md)
- [Info Overlay System](../data/README_InfoOverlaySystem.md)

