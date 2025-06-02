# Info Overlay System Architecture

## Overview
The info overlay system has been refactored to be fully scalable and data-driven. This system automatically generates buttons and content based on cultivar attributes, making it easy to add new cultivars without hardcoding button configurations.

## File Structure

### `data/infoOverlayContent.ts`
Contains all the educational content and button configurations for the info overlay system.

#### Key Components:
- **`InfoOverlayContent`** - Interface for individual info cards
- **`InfoOverlayData`** - Collection of info content by ID
- **`ButtonConfig`** - Button styling and label configuration
- **`baseInfoOverlayData`** - Universal content that applies to all cultivars
- **`cultivarSpecificInfoData`** - Cultivar-specific content overrides
- **`generateButtonConfigs()`** - Automatically generates buttons based on cultivar attributes

## How It Works

### 1. Base Content System
All standard strawberry information (day-neutral, fusarium resistance, etc.) is defined once in `baseInfoOverlayData` and automatically available to all cultivars.

### 2. Automatic Button Generation
The `generateButtonConfigs()` function reads a cultivar's attributes and automatically:
- Adds appropriate flower type button (Day-Neutral/Short-Day)
- Generates buttons for all attributes with matching content
- Applies correct CSS classes and styling
- Creates proper click handlers

### 3. Cultivar-Specific Overrides
For cultivars that need specialized content (like Alturas's specific yield data), add entries to `cultivarSpecificInfoData` to override or supplement the base content.

## Adding New Cultivars

### Step 1: Add Cultivar Data
In `data/cultivars.ts`, add your new cultivar with appropriate attributes:

```typescript
{
  id: 'new-cultivar',
  name: 'New Cultivar',
  flowerType: 'DN', // or 'SD'
  attributes: ['fusarium resistant', 'excellent flavor'],
  attribute2: ['high yield'],
  // ... other properties
}
```

### Step 2: Add Specific Content (Optional)
If the cultivar needs specialized content, add to `cultivarSpecificInfoData`:

```typescript
'new-cultivar': {
  'high-yield': {
    icon: '📈',
    title: 'New Cultivar High Yield Performance',
    content: `<h3>Specific yield data for this cultivar...</h3>`
  }
}
```

### Step 3: Done!
The system automatically:
- Generates appropriate buttons
- Loads base content for standard attributes
- Applies cultivar-specific overrides where available
- Handles all styling and interactions

## Supported Attributes

### Current Attribute → Button Mappings:
- `'day-neutral'` → Green button with ☀️
- `'short-day'` → Green button with 🌙
- `'fusarium resistant'` → Blue button with 🛡️
- `'macrophomina resistant'` → Blue button with 🛡️
- `'high yield'` → Pink button with 📈
- `'excellent flavor'` → Pink button with 😋
- `'premium quality'` → Blue button with 💎
- `'ultra early'` → Green button with 🌅
- `'organic'` → Green button with 🌿
- `'cold tolerant'` → Blue button with ❄️
- `'rugged'` → Blue button with 💪

## Adding New Attributes

### Step 1: Add Content
Add to `baseInfoOverlayData`:

```typescript
'new-attribute': {
  icon: '🔥',
  title: 'New Attribute Title',
  content: `<h3>Educational content about this attribute...</h3>`
}
```

### Step 2: Add Button Mapping
Add to `attributeButtonMap`:

```typescript
'new attribute': {
  className: 'premium-button-blue-glass',
  icon: '🔥',
  label: 'NEW ATTRIBUTE'
}
```

### Step 3: Use in Cultivars
Add `'new attribute'` to any cultivar's `attributes` or `attribute2` arrays.

## Benefits of This Architecture

1. **Scalable** - Easy to add new cultivars and attributes
2. **Maintainable** - All content in one place
3. **Consistent** - Automatic styling and behavior
4. **Flexible** - Support for cultivar-specific overrides
5. **Type-Safe** - Full TypeScript support
6. **DRY** - No code duplication between cultivars

## Template Ready
This system is designed as a template for the 9 additional real cultivar info panes you'll be building. Each new cultivar automatically gets:
- Proper button generation
- Consistent styling
- Educational content
- Interactive overlays
- Mobile/desktop optimization

Simply add cultivar data and the system handles the rest! 