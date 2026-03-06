# Interactive Globe Integration Guide

## ✅ Completed Setup

The interactive globe component has been successfully integrated into your RAG Document Q&A System!

### What Was Done

1. **Tailwind CSS Setup**
   - Installed `tailwindcss`, `postcss`, and `autoprefixer`
   - Created `tailwind.config.js` with shadcn-compatible theme
   - Created `postcss.config.js`
   - Updated `styles/globals.css` with Tailwind directives and CSS variables

2. **Utility Dependencies**
   - Installed `clsx` and `tailwind-merge` for className management
   - Created `lib/utils.ts` with the `cn()` utility function

3. **Component Structure**
   - Created `components/ui/` directory (shadcn standard)
   - Added `components/ui/interactive-globe.tsx` component

4. **Integration**
   - Replaced the old `Background3D` component with `InteractiveGlobe`
   - Updated `pages/index.tsx` to use the new globe
   - Created `pages/globe-demo.tsx` for a showcase page

## 🎨 Component Features

The Interactive Globe includes:
- **1200+ dots** rendered using Fibonacci sphere distribution
- **Animated connections** between global locations with traveling dots
- **Pulsing markers** for key locations (10 default cities)
- **Drag to rotate** - fully interactive with mouse/touch
- **Auto-rotation** - smooth automatic spinning
- **Depth-based rendering** - back-face culling for realistic 3D effect
- **Customizable colors** - dots, arcs, and markers
- **Responsive** - adapts to container size

## 🚀 Usage

### Basic Usage (Current Implementation)

```tsx
import { InteractiveGlobe } from '@/components/ui/interactive-globe';

<InteractiveGlobe 
  size={700}
  dotColor="rgba(100, 180, 255, ALPHA)"
  arcColor="rgba(100, 180, 255, 0.6)"
  markerColor="rgba(100, 220, 255, 1)"
  autoRotateSpeed={0.003}
/>
```

### Advanced Usage with Custom Data

```tsx
<InteractiveGlobe 
  size={600}
  dotColor="rgba(100, 180, 255, ALPHA)"
  arcColor="rgba(100, 180, 255, 0.5)"
  markerColor="rgba(100, 220, 255, 1)"
  autoRotateSpeed={0.002}
  markers={[
    { lat: 37.78, lng: -122.42, label: "San Francisco" },
    { lat: 51.51, lng: -0.13, label: "London" },
    // Add more markers
  ]}
  connections={[
    { from: [37.78, -122.42], to: [51.51, -0.13] },
    // Add more connections
  ]}
/>
```

## 📁 File Structure

```
rag_frontend/
├── components/
│   └── ui/
│       └── interactive-globe.tsx    # Main globe component
├── lib/
│   └── utils.ts                     # Utility functions (cn)
├── pages/
│   ├── index.tsx                    # Main page (updated)
│   └── globe-demo.tsx               # Demo showcase page
├── styles/
│   └── globals.css                  # Updated with Tailwind
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
└── tsconfig.json                    # Already configured with @ alias
```

## 🎯 Available Pages

1. **Main Application** - `http://localhost:3000`
   - Your RAG Q&A interface with the globe as background

2. **Globe Demo** - `http://localhost:3000/globe-demo`
   - Showcase page with stats and information layout

## ⚙️ Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `size` | `number` | `600` | Canvas size in pixels |
| `dotColor` | `string` | `"rgba(100, 180, 255, ALPHA)"` | Globe dot color (ALPHA is replaced dynamically) |
| `arcColor` | `string` | `"rgba(100, 180, 255, 0.5)"` | Connection arc color |
| `markerColor` | `string` | `"rgba(100, 220, 255, 1)"` | Marker and label color |
| `autoRotateSpeed` | `number` | `0.002` | Rotation speed (radians per frame) |
| `connections` | `Array` | Default 9 connections | Array of `{from: [lat, lng], to: [lat, lng]}` |
| `markers` | `Array` | Default 10 cities | Array of `{lat, lng, label?}` |

## 🎨 Customization

### Change Colors

```tsx
// Blue theme (current)
<InteractiveGlobe 
  dotColor="rgba(100, 180, 255, ALPHA)"
  arcColor="rgba(100, 180, 255, 0.6)"
  markerColor="rgba(100, 220, 255, 1)"
/>

// Purple theme
<InteractiveGlobe 
  dotColor="rgba(168, 85, 247, ALPHA)"
  arcColor="rgba(168, 85, 247, 0.6)"
  markerColor="rgba(192, 132, 252, 1)"
/>

// Green theme
<InteractiveGlobe 
  dotColor="rgba(34, 197, 94, ALPHA)"
  arcColor="rgba(34, 197, 94, 0.6)"
  markerColor="rgba(74, 222, 128, 1)"
/>
```

### Adjust Speed

```tsx
// Slower rotation
<InteractiveGlobe autoRotateSpeed={0.001} />

// Faster rotation
<InteractiveGlobe autoRotateSpeed={0.005} />

// No auto-rotation
<InteractiveGlobe autoRotateSpeed={0} />
```

## 🔧 Troubleshooting

### If the globe doesn't appear:
1. Make sure the dev server is running: `npm run dev`
2. Check browser console for errors
3. Verify Tailwind is working (check if other styles apply)

### If Tailwind classes don't work:
1. Restart the dev server after config changes
2. Clear `.next` cache: `rm -rf .next` (or `rmdir /s /q .next` on Windows)
3. Verify `tailwind.config.js` content paths include your files

### If @ imports fail:
1. Check `tsconfig.json` has the paths configuration
2. Restart your IDE/editor
3. Restart the TypeScript server

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "clsx": "^2.x.x",
    "tailwind-merge": "^2.x.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x.x",
    "postcss": "^8.x.x",
    "autoprefixer": "^10.x.x"
  }
}
```

## 🎉 Next Steps

1. **Customize the globe** - Adjust colors, speed, and markers to match your brand
2. **Add real data** - Connect markers to your document sources
3. **Enhance interactions** - Add click handlers to markers for navigation
4. **Optimize performance** - Adjust dot count or rendering quality for slower devices

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

**Note**: The old `Background3D.tsx` component using Three.js is still in the `animations/` folder but is no longer used. You can safely delete it if you don't need it.
