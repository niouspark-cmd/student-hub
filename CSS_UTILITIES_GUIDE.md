# 🎨 OMNI Design System - CSS Utilities Quick Reference

## Glassmorphism

### Basic Glass Effect
```tsx
<div className="glass">
  {/* Frosted glass with blur */}
</div>
```

### Strong Glass Effect
```tsx
<div className="glass-strong">
  {/* Enhanced blur with saturation */}
</div>
```

### Subtle Glass Effect
```tsx
<div className="glass-subtle">
  {/* Light glass for overlays */}
</div>
```

---

## Bento Grid System

### Basic Bento Grid
```tsx
<div className="bento-grid">
  <div className="bento-card">Card 1</div>
  <div className="bento-card">Card 2</div>
  <div className="bento-card">Card 3</div>
</div>
```

### Large Bento Card (2 columns)
```tsx
<div className="bento-card bento-lg">
  {/* Spans 2 columns on desktop */}
</div>
```

### Extra Large Bento Card (3 columns)
```tsx
<div className="bento-card bento-xl">
  {/* Spans 3 columns on desktop */}
</div>
```

**Note**: All bento cards automatically collapse to single column on mobile.

---

## Animations

### Gradient Animations
```tsx
<div className="animate-gradient-x bg-gradient-to-r from-primary to-accent">
  {/* Horizontal gradient animation */}
</div>

<div className="animate-gradient-y bg-gradient-to-b from-primary to-accent">
  {/* Vertical gradient animation */}
</div>
```

### Glow Pulse
```tsx
<div className="animate-pulse-glow">
  {/* Pulsing glow effect */}
</div>
```

### Shimmer Effect
```tsx
<div className="animate-shimmer">
  {/* Loading shimmer */}
</div>
```

### Float Animation
```tsx
<div className="animate-float">
  {/* Gentle floating motion */}
</div>
```

---

## Glow Effects

### Standard Glow
```tsx
<button className="omni-glow">
  {/* Subtle glow around element */}
</button>
```

### Hover Glow
```tsx
<button className="omni-glow-hover">
  {/* Glow appears on hover */}
</button>
```

### Strong Glow
```tsx
<button className="omni-glow-strong">
  {/* Intense double glow */}
</button>
```

### Neon Border
```tsx
<div className="neon-border">
  {/* Glowing border effect */}
</div>
```

---

## Gradients

### Primary Gradient
```tsx
<div className="gradient-primary">
  {/* Primary to accent gradient */}
</div>
```

### Mesh Gradient
```tsx
<div className="gradient-mesh">
  {/* Multi-point radial gradient */}
</div>
```

### Gradient Text
```tsx
<h1 className="gradient-text">
  {/* Gradient-filled text */}
</h1>
```

---

## Trust Badges

### Basic Trust Badge
```tsx
<div className="trust-badge">
  Shield Escrow Protected
</div>
```

**Features**:
- Auto-includes checkmark icon
- Glassmorphic background
- Uppercase text
- Rounded corners

---

## Mission Cards (Vendor Dashboard)

### Standard Mission Card
```tsx
<div className="mission-card">
  {/* Order card */}
</div>
```

### Active Mission Card
```tsx
<div className="mission-card active">
  {/* Highlighted with primary border */}
</div>
```

### Urgent Mission Card
```tsx
<div className="mission-card urgent">
  {/* Red border with pulse animation */}
</div>
```

---

## Floating Navigation

### iOS-Style Bottom Nav
```tsx
<nav className="floating-nav">
  <a href="/home">Home</a>
  <a href="/search">Search</a>
  <a href="/profile">Profile</a>
</nav>
```

**Features**:
- Fixed at bottom center
- Glassmorphic background
- Auto-adjusts on mobile

---

## Floating Action Button (FAB)

### Basic FAB
```tsx
<button className="fab">
  🛒
</button>
```

**Features**:
- Fixed bottom-right
- Circular shape
- Primary color
- Glow effect
- Hover scale
- Auto-repositions on mobile (above nav)

---

## Chart Effects

### Glowing Chart
```tsx
<div className="chart-glow">
  <ResponsiveContainer>
    {/* Chart component */}
  </ResponsiveContainer>
</div>
```

---

## Theater Mode

### Full-Screen Video
```tsx
<div className="theater-mode">
  <video src="..." />
</div>
```

**Features**:
- Full viewport
- Black background
- Centered content
- Object-fit contain

---

## Scroll Utilities

### Smooth Scroll
```tsx
<div className="smooth-scroll">
  {/* Smooth scrolling container */}
</div>
```

### Hide Scrollbar
```tsx
<div className="hide-scrollbar">
  {/* Scrollable but no scrollbar */}
</div>
```

---

## Responsive Utilities

### Mobile-Only
```tsx
<div className="md:hidden">
  {/* Visible only on mobile */}
</div>
```

### Desktop-Only
```tsx
<div className="hidden md:block">
  {/* Visible only on desktop */}
</div>
```

---

## Common Patterns

### Glassmorphic Card with Hover
```tsx
<div className="glass-strong rounded-[2rem] p-8 hover:border-primary/30 transition-all">
  <h3 className="gradient-text">Title</h3>
  <p>Content</p>
</div>
```

### Bento Category Card
```tsx
<div className="bento-card group cursor-pointer">
  <div className="text-6xl mb-3 animate-float">🍕</div>
  <h3 className="text-sm font-black uppercase">Food & Snacks</h3>
  <p className="text-xs text-foreground/40">142 Items</p>
</div>
```

### Trust Badge Row
```tsx
<div className="flex flex-wrap gap-3">
  <div className="trust-badge">🛡️ Shield Escrow</div>
  <div className="trust-badge">✓ Verified</div>
  <div className="trust-badge">⚡ Flash-Match</div>
</div>
```

### Neon Glow Button
```tsx
<button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest omni-glow-strong hover:scale-105 transition-all">
  Buy Now
</button>
```

### Product Card (Clickable)
```tsx
<div 
  onClick={() => navigate(`/products/${id}`)}
  className="bento-card cursor-pointer group"
>
  <img className="group-hover:scale-110 transition-transform" />
  <h3>Product Title</h3>
  <p className="gradient-text">₵99.00</p>
</div>
```

---

## CSS Variables Reference

### Colors
```css
--background: #f8fafc / #050505
--foreground: #0f172a / #ffffff
--surface: #ffffff / #0d1117
--surface-border: #e2e8f0 / rgba(255,255,255,0.05)
--primary: #4f46e5 / #39FF14
--primary-foreground: #ffffff / #000000
--accent: #8b5cf6 / #39FF14
--omni-green: #39FF14
```

### Glassmorphism
```css
--glass-bg: rgba(255,255,255,0.7) / rgba(13,17,23,0.7)
--glass-border: rgba(255,255,255,0.18) / rgba(255,255,255,0.08)
--glass-shadow: 0 8px 32px 0 rgba(31,38,135,0.15) / rgba(0,0,0,0.37)
--blur-amount: 16px / 20px
```

### Bento Grid
```css
--bento-gap: 1.5rem / 1rem (mobile)
--bento-radius: 2rem / 1.5rem (mobile)
```

---

## Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 640px) and (max-width: 768px) { }

/* Desktop */
@media (min-width: 768px) { }
```

---

## Pro Tips

### 1. Combine Effects
```tsx
<div className="glass-strong bento-card omni-glow-hover animate-float">
  {/* Multiple effects work together */}
</div>
```

### 2. Use Group Hover
```tsx
<div className="group">
  <img className="group-hover:scale-110" />
  <div className="opacity-0 group-hover:opacity-100">
    {/* Appears on parent hover */}
  </div>
</div>
```

### 3. Responsive Spacing
```tsx
<div className="p-4 md:p-8 lg:p-12">
  {/* Padding increases with screen size */}
</div>
```

### 4. Conditional Glow
```tsx
<div className={isActive ? 'omni-glow-strong' : 'opacity-50'}>
  {/* Dynamic glow based on state */}
</div>
```

### 5. Stacking Contexts
```tsx
<div className="relative">
  <div className="absolute inset-0 gradient-mesh opacity-30" />
  <div className="relative z-10">
    {/* Content above gradient */}
  </div>
</div>
```

---

## Performance Notes

- ✅ All animations use CSS transforms (GPU-accelerated)
- ✅ Backdrop-filter has fallbacks for older browsers
- ✅ Animations can be disabled with `prefers-reduced-motion`
- ✅ Glow effects use box-shadow (performant)
- ✅ Gradients are static (no performance hit)

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Backdrop-filter may not work on older browsers (graceful degradation)

---

**Quick Start**: Copy any pattern above and customize colors, sizes, and content to match your needs!

**Documentation**: See `UI_TRANSFORMATION_SUMMARY.md` for complete feature list.

**Examples**: Check `src/app/marketplace/page.tsx` for real-world usage.
