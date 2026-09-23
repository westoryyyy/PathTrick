# Tailwind CSS Migration Guide

This guide helps you migrate CSS modules to Tailwind utility classes across the PathTrick project.

## Why Migrate to Tailwind?

- **Reduced boilerplate**: No need for CSS modules with hundreds of lines
- **Consistency**: Centralized design system through utility classes
- **Scalability**: Easy to maintain and extend
- **Performance**: Unused styles are automatically purged
- **Colocation**: Styles live with components in JSX

## Quick Start

### 1. Understanding Tailwind Utilities

Instead of:
```css
.button {
  padding: 12px 20px;
  background-color: #64748b;
  border: 3px solid #0f172a;
  border-radius: 6px;
  cursor: pointer;
}
```

Use:
```jsx
<button className="px-5 py-3 bg-slate-500 border-3 border-slate-900 rounded cursor-pointer">
  Click me
</button>
```

### 2. Common Conversions

| CSS | Tailwind | Notes |
|-----|----------|-------|
| `padding: 24px` | `p-6` | Default unit is 4px (24px = 6 × 4px) |
| `gap: 28px` | `gap-7` | 28px = 7 × 4px |
| `width: 100%` | `w-full` | Utility for 100% width |
| `background-color: #8c5d41` | `bg-[#8c5d41]` | Arbitrary values with square brackets |
| `border: 6px solid` | `border-6` | Custom border width configured |
| `border-radius: 8px` | `rounded-lg` or `rounded` | Use preset or arbitrary `rounded-[8px]` |
| `display: flex` | `flex` | |
| `flex-direction: column` | `flex-col` | |
| `justify-content: center` | `justify-center` | |
| `align-items: center` | `items-center` | |
| `gap: 8px` | `gap-2` | 8px = 2 × 4px |
| `opacity: 0.5` | `opacity-50` | Opacity values are 0-100 |
| `transition: all 0.2s` | `transition-all duration-200` | Duration in ms |
| `font-family: monospace` | `font-mono` | Configured in theme |
| `font-size: 0.8rem` | `text-sm` or `text-[0.8rem]` | Use preset or arbitrary |
| `color: #fff` | `text-white` | |
| `text-shadow: 2px 2px 0 #3b261b` | `style={{textShadow: '...'}}` | Use inline style for complex shadows |
| `box-shadow: inset ...` | `shadow-lg` or `style={{...}}` | Inset shadows use inline style |
| `:hover` | `hover:` | |
| `:disabled` | `disabled:` | |
| `:active` | `active:` | |
| `@media (max-width: 640px)` | `sm:` | Breakpoint prefixes |

### 3. Step-by-Step Migration Process

#### Step 1: Identify the CSS Module
```
src/components/assessment/AssessmentShell.module.css
```

#### Step 2: Create the Tailwind Version
Replace className imports with direct Tailwind classes:

**Before:**
```tsx
import styles from './AssessmentShell.module.css';

<div className={styles.shell}>
  <div className={styles.progressBar}>...</div>
</div>
```

**After:**
```tsx
// No CSS module import needed!

<div className="relative z-10 w-full max-w-3xl flex flex-col gap-7 bg-[#8c5d41] border-6 border-[#3b261b] rounded-lg shadow-lg p-6">
  <div className="w-full h-3 bg-[#3b261b] border-2 border-[#2a1b13] rounded-full">...</div>
</div>
```

#### Step 3: Handle Complex Styles with Inline Styles
Some styles (especially shadows and text-shadows) are better kept as inline styles:

```tsx
<div 
  className="..." 
  style={{
    boxShadow: 'inset 0 0 0 4px #a37255, inset 0 0 0 8px #704730, 0 24px 48px rgba(0, 0, 0, 0.7)',
    textShadow: '2px 2px 0 #3b261b'
  }}
>
  Content
</div>
```

#### Step 4: Conditional Classes with Template Literals
Use template literals for dynamic classes:

```tsx
<button 
  className={`px-7 py-3.5 rounded border-3 flex items-center gap-2 transition-all duration-200 ${
    canNext && !isSubmitting
      ? 'bg-amber-500 border-amber-900 text-white hover:bg-amber-400 active:translate-y-1'
      : 'bg-slate-500 border-slate-900 text-white opacity-50'
  }`}
>
  Click me
</button>
```

Or use `clsx` library for cleaner code:
```tsx
import clsx from 'clsx';

<button 
  className={clsx(
    'px-7 py-3.5 rounded border-3 flex items-center gap-2 transition-all duration-200',
    canNext && !isSubmitting 
      ? 'bg-amber-500 border-amber-900 text-white hover:bg-amber-400 active:translate-y-1'
      : 'bg-slate-500 border-slate-900 text-white opacity-50'
  )}
>
  Click me
</button>
```

### 4. Custom Animations

Already configured in `tailwind.config.js`:

```tsx
// Using shellIn animation
<div className="animate-shellIn">
  Animates in with fade and slide
</div>

// Using contentFade animation
<div className="animate-contentFade">
  Animates in with fade and horizontal slide
</div>
```

### 5. Responsive Design

Use Tailwind breakpoints:

```tsx
<div className="text-base sm:text-sm md:text-xs lg:text-base">
  Responsive text size
</div>

<div className="flex flex-col sm:flex-row">
  Stack vertically on mobile, horizontally on larger screens
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 6. Color Values

Use Tailwind color palette or arbitrary colors:

```tsx
{/* Preset colors */}
<div className="text-blue-500 bg-blue-100 border-blue-900">
  Preset color
</div>

{/* Arbitrary colors */}
<div className="text-[#DD1A21] bg-[#8c5d41] border-[#3b261b]">
  Custom color
</div>
```

### 7. Migration Checklist

When migrating a component:

- [ ] Remove CSS module import
- [ ] Delete or archive `.module.css` file
- [ ] Convert static classes to Tailwind
- [ ] Convert pseudo-classes (`:hover`, `:active`, `:disabled`) to Tailwind prefixes
- [ ] Move complex shadows/text-shadows to inline styles
- [ ] Test responsive behavior
- [ ] Test animations and transitions
- [ ] Run the development server to verify changes
- [ ] Test on different screen sizes

### 8. Common Pitfalls

**Spacing Scale:**
- Tailwind uses 4px increments: `p-1` = 4px, `p-6` = 24px
- For odd sizes like 28px, use `gap-7` (7 × 4px)

**Borders:**
- Default border is 1px
- For larger borders, use `border-3`, `border-4`, etc.
- Custom width: `border-[6px]`

**Opacity:**
- Use `opacity-50` (50%), not `opacity-0.5`
- Values: 0, 5, 10, 20, ..., 90, 95, 100

**Text Shadow & Box Shadow:**
- Use inline `style={{textShadow: '...'}}` for complex effects
- Simple shadows use Tailwind `shadow-lg`, `shadow-xl`

**Font Size:**
- Common presets: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`
- Arbitrary: `text-[0.8rem]`, `text-[1.3rem]`

## Example: Before & After

### Before (CSS Module)
```tsx
// AssessmentShell.tsx
import styles from './AssessmentShell.module.css';

export default function AssessmentShell({ canNext, onNext }) {
  return (
    <div className={styles.shell}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>
      <button 
        className={`${styles.nextBtn} ${canNext ? styles.nextBtnActive : ''}`}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}
```

```css
/* AssessmentShell.module.css */
.shell {
  position: relative;
  background-color: #8c5d41;
  border: 6px solid #3b261b;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.progressBar {
  width: 100%;
  height: 12px;
  background: #3b261b;
  border: 2px solid #2a1b13;
  border-radius: 6px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
}

.nextBtn {
  padding: 14px 28px;
  background: #64748b;
  border: 3px solid #0f172a;
  opacity: 0.5;
  cursor: not-allowed;
}

.nextBtnActive {
  background: #f59e0b;
  border-color: #78350f;
  opacity: 1;
  cursor: pointer;
}
```

### After (Tailwind)
```tsx
// AssessmentShell.tsx
export default function AssessmentShell({ canNext, onNext }) {
  return (
    <div className="relative bg-[#8c5d41] border-6 border-[#3b261b] p-6 flex flex-col gap-7">
      <div className="w-full h-3 bg-[#3b261b] border-2 border-[#2a1b13] rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500" />
      </div>
      <button 
        className={`px-7 py-3.5 border-3 transition-all ${
          canNext 
            ? 'bg-amber-500 border-amber-900 opacity-100 cursor-pointer' 
            : 'bg-slate-500 border-slate-900 opacity-50 cursor-not-allowed'
        }`}
        onClick={onNext}
        disabled={!canNext}
      >
        Next
      </button>
    </div>
  );
}
```

**Result:** 0 CSS files, 200+ fewer lines, better maintainability!

---

## Quick Reference: Tailwind Config

Your Tailwind config at `tailwind.config.js` includes:

```js
extend: {
  borderWidth: {
    6: '6px',  // For border-6
  },
  animation: {
    shellIn: 'shellIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
    contentFade: 'contentFade 0.35s ease forwards',
  },
}
```

## Tools

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Color Picker**: https://tailwindcss.com/docs/customizing-colors
- **Playground**: https://play.tailwindcss.com/

---

Feel free to reference this guide when migrating components! 🎨
