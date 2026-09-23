# Tailwind CSS Cheatsheet for PathTrick

Quick reference for common Tailwind classes used in PathTrick components.

## Layout & Spacing

```jsx
// Flexbox
<div className="flex flex-col items-center justify-center gap-4">
  // gap-4 = 16px, flex-col = flex-direction: column
</div>

// Grid
<div className="grid grid-cols-3 gap-6">
  // 3 columns, 24px gap
</div>

// Padding
<div className="p-6 px-8 py-4">
  // p-6 = padding all sides (24px)
  // px-8 = padding left/right (32px)
  // py-4 = padding top/bottom (16px)
</div>

// Margin (negative values with -)
<div className="m-4 -mt-2 mx-auto">
  // m-4 = margin all (16px)
  // -mt-2 = margin-top negative (8px)
  // mx-auto = margin left/right auto (center)
</div>
```

## Sizing

```jsx
// Width/Height
<div className="w-full h-screen max-w-4xl">
  // w-full = 100%
  // h-screen = 100vh
  // max-w-4xl = max-width 56rem
</div>

// Min/Max
<div className="min-h-screen max-h-96">
</div>
```

## Colors

```jsx
// Background
<div className="bg-slate-500 bg-[#8c5d41]">
  // bg-slate-500 = preset Tailwind color
  // bg-[#8c5d41] = arbitrary hex color
</div>

// Text
<span className="text-white text-[#DD1A21]">
  // text-white = #fff
  // Custom colors with brackets
</span>

// Border
<div className="border-2 border-slate-900 border-[#3b261b]">
</div>
```

## Typography

```jsx
// Font
<p className="font-mono text-sm font-bold">
  // font-mono = "Press Start 2P" (pixel font for PathTrick)
  // font-sans = Inter (default)
  // font-bold = font-weight 700
</p>

// Text Size
<h1 className="text-2xl"> // 1.5rem
<h2 className="text-xl">  // 1.25rem
<p className="text-base">  // 1rem
<span className="text-sm"> // 0.875rem
<label className="text-xs"> // 0.75rem
<small className="text-[0.55rem]"> // arbitrary

// Text Color
<p className="text-gray-600 text-amber-300 text-[#fbbf24]">

// Letter Spacing (for pixel-perfect look)
<h1 className="tracking-wider"> // letter-spacing: 0.05em

// Text Shadow (use inline style)
<h1 style={{ textShadow: '2px 2px 0 #3b261b' }}>
```

## Borders & Shadows

```jsx
// Border
<div className="border border-2 border-4 border-[6px]">
  // border = 1px
  // border-2 = 2px
  // border-4 = 4px
  // border-[6px] = arbitrary 6px (custom width)
</div>

// Border Radius
<div className="rounded"> // 4px
<div className="rounded-lg"> // 8px
<div className="rounded-full"> // 50%
<div className="rounded-[12px]"> // arbitrary

// Box Shadow
<div className="shadow-lg">
  // Use Tailwind presets for simple shadows
</div>

// Complex Shadow (use inline style)
<div style={{
  boxShadow: 'inset 0 0 0 4px #a37255, 0 24px 48px rgba(0, 0, 0, 0.7)'
}}>
```

## Backgrounds

```jsx
// Solid Color
<div className="bg-amber-500">

// Gradient
<div className="bg-gradient-to-r from-green-400 to-green-500">
  // Gradients use from/to with direction
  // Directions: to-r, to-b, to-t, to-l, to-br, etc.
</div>

// Background Size/Position
<div className="bg-cover bg-center bg-no-repeat">
```

## Opacity & Transitions

```jsx
// Opacity
<div className="opacity-50 hover:opacity-100">
  // opacity-0 to opacity-100 (increment of 5)
</div>

// Transition
<div className="transition-all duration-300">
  // transition-all = all properties
  // duration-300 = 300ms
  // Also: transition-opacity, transition-colors
</div>

// Transform
<button className="transform hover:scale-110 active:translate-y-1">
  // scale(1.1) on hover
  // translate Y 4px on click
</button>
```

## Pseudo-Classes & States

```jsx
// Hover
<button className="bg-blue-500 hover:bg-blue-600">

// Active (pressed)
<button className="active:translate-y-1 active:shadow-none">

// Disabled
<button className="disabled:opacity-50 disabled:cursor-not-allowed">

// Focus
<input className="focus:ring-2 focus:ring-blue-500">

// Group hover (parent hover affects child)
<div className="group">
  <button className="group-hover:bg-red-500">
</div>
```

## Responsive Design (Breakpoints)

```jsx
// Mobile-first approach
<div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
  // Mobile: text-xs
  // 640px+: text-sm
  // 768px+: text-base
  // 1024px+: text-lg
  // 1280px+: text-xl
</div>

// Hide/Show
<div className="hidden sm:block">
  // Hidden on mobile, visible on sm+
</div>

// Responsive Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
```

## Display & Positioning

```jsx
// Display
<div className="flex"> // display: flex
<div className="grid"> // display: grid
<div className="hidden"> // display: none
<div className="block"> // display: block
<div className="inline-block"> // display: inline-block

// Position
<div className="absolute top-0 left-0"> // positioning + coordinates
<div className="fixed inset-0"> // position: fixed; cover full screen
<div className="relative"> // position: relative

// Z-Index
<div className="z-10"> // z-index: 10
<div className="z-50"> // z-index: 50
```

## Overflow & Visibility

```jsx
// Overflow
<div className="overflow-hidden"> // hide overflow
<div className="overflow-auto"> // scrollbar if needed
<div className="overflow-scroll"> // always show scrollbar

// Visibility
<div className="visible"> // visibility: visible
<div className="invisible"> // visibility: hidden
```

## Cursor & Interaction

```jsx
<button className="cursor-pointer">
<div className="cursor-not-allowed">
<a className="cursor-default">
```

## Animations (PathTrick Custom)

```jsx
// Shell entrance animation
<div className="animate-shellIn">
  // Fades in and slides up over 450ms

// Content fade animation
<div className="animate-contentFade">
  // Fades in with subtle horizontal slide over 350ms

// Spinner
<div className="animate-spin">
  // Built-in spin animation
```

## Compound Classes (Real Examples)

```jsx
// Button (inactive)
<button className="px-5 py-3 bg-slate-500 border-3 border-slate-900 text-white rounded cursor-not-allowed disabled:opacity-50">

// Button (active, with hover)
<button className="px-7 py-3.5 bg-amber-500 border-3 border-amber-900 text-white rounded hover:bg-amber-400 active:translate-y-1 cursor-pointer">

// Card
<div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">

// Progress Bar
<div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
  <div className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500" />
</div>

// Step Badge
<span className="px-3 py-1 bg-violet-500 bg-opacity-20 border border-violet-400 text-violet-300 text-xs rounded font-mono">
  Step 1
</span>
```

## Common Breakpoint Values

| Class | Width |
|-------|-------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Common Spacing Values

| Class | Size |
|-------|------|
| `p-1`, `m-1` | 4px |
| `p-2`, `m-2` | 8px |
| `p-3`, `m-3` | 12px |
| `p-4`, `m-4` | 16px |
| `p-6`, `m-6` | 24px |
| `p-7`, `m-7` | 28px |
| `p-8`, `m-8` | 32px |

## Tips & Tricks

1. **Arbitrary Values**: Use `[value]` for custom values
   ```jsx
   className="text-[0.55rem] bg-[#8c5d41] border-[6px]"
   ```

2. **Conditional Classes**: Use template literals or `clsx`
   ```jsx
   className={`base-class ${isActive ? 'active-class' : 'inactive-class'}`}
   ```

3. **Spacing Scale**: Tailwind uses 4px base unit
   - `p-1` = 4px, `p-6` = 24px, `gap-7` = 28px

4. **Colors with Opacity**: Use `/opacity` modifier
   ```jsx
   className="bg-black/50" // 50% opacity
   ```

5. **Hover/Focus States**: Always include for accessibility
   ```jsx
   <button className="hover:opacity-80 focus:ring-2">
   ```

6. **Dark Mode**: Add to HTML element
   ```jsx
   <html data-theme="dark">
   ```

---

**PathTrick Tip:** Use pixel fonts (`font-mono`) for that authentic game aesthetic! 🎮
