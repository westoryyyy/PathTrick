# Getting Started with Tailwind CSS at PathTrick

## 🎯 Start Here

This guide helps you use Tailwind CSS to build forms, buttons, and components without creating CSS files.

---

## 📝 Quick Example

### ❌ Old Way (CSS Module)
```
src/components/MyForm.tsx + MyForm.module.css (2 files, 150+ lines)
```

### ✅ New Way (Tailwind)
```tsx
// src/components/MyForm.tsx (1 file, 40 lines)
export function MyForm() {
  return (
    <form className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <label className="flex flex-col gap-2">
        <span className="font-pixel text-sm font-bold text-gray-700">Email</span>
        <input 
          type="email"
          className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </label>
      
      <button 
        type="submit"
        className="px-4 py-3 bg-blue-500 text-white rounded font-bold hover:bg-blue-600 active:scale-95 transition-all"
      >
        Submit
      </button>
    </form>
  );
}
```

**Benefits:** 1 file, no context switching, faster to write ⚡

---

## 🚀 Your Tailwind Workflow

### Step 1: Write HTML + Tailwind Classes
```tsx
<div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-purple-900 to-blue-900 rounded-lg">
  <h1 className="text-3xl font-bold text-white mb-4">Welcome!</h1>
  <p className="text-gray-300 text-center max-w-md">Start your journey here</p>
</div>
```

### Step 2: Use Pseudo-Classes for Interactivity
```tsx
<button className="bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-50 transition-all">
  Click me
</button>
```

### Step 3: Make it Responsive
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Stack 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 📚 Find What You Need

### Most Common Classes

| Need | Tailwind | Example |
|------|----------|---------|
| Spacing | `p-6`, `m-4`, `gap-3` | `<div className="p-6 gap-4">` |
| Color | `bg-blue-500`, `text-white`, `border-gray-300` | `<div className="bg-[#8c5d41]">` |
| Size | `w-full`, `h-screen`, `max-w-md` | `<div className="w-full max-w-4xl">` |
| Font | `text-lg`, `font-bold`, `font-pixel` | `<h1 className="text-2xl font-mono">` |
| Layout | `flex`, `grid`, `absolute`, `relative` | `<div className="flex items-center">` |
| Border | `border`, `border-2`, `rounded-lg` | `<div className="border-2 rounded">` |
| Shadow | `shadow-lg`, `shadow-xl` | `<div className="shadow-lg">` |
| State | `hover:`, `active:`, `disabled:`, `focus:` | `<button className="hover:bg-red-600">` |
| Screen | `sm:`, `md:`, `lg:`, `xl:` | `<div className="text-sm md:text-base">` |

### Need Quick Lookup?

👉 Open `TAILWIND_CHEATSHEET.md` for all classes and examples

### Need Step-by-Step Guide?

👉 Read `TAILWIND_MIGRATION_GUIDE.md` for detailed migration instructions

### Need Summary & Tips?

👉 Check `TAILWIND_SETUP_SUMMARY.md` for overview and FAQs

---

## 🎨 PathTrick-Specific Classes

### Pixel Font (Game Aesthetic)
```tsx
<p className="font-pixel text-sm">
  Text in pixel font (Press Start 2P)
</p>
```

### Custom Colors (Wood/Game Theme)
```tsx
<div className="bg-[#8c5d41] border-[#3b261b] text-[#DD1A21]">
  Wood and red accent colors
</div>
```

### Custom Borders
```tsx
<div className="border-6 border-[#3b261b]">
  6px thick border (custom configuration)
</div>
```

### Animations
```tsx
<div className="animate-shellIn">
  Fades in with slide (component entrance)
</div>

<div className="animate-contentFade">
  Fades in with horizontal slide (content change)
</div>
```

### Complex Shadows (Use Inline Style)
```tsx
<div 
  className="bg-[#8c5d41] p-6 rounded"
  style={{
    boxShadow: 'inset 0 0 0 4px #a37255, inset 0 0 0 8px #704730, 0 24px 48px rgba(0, 0, 0, 0.7)'
  }}
>
  Wood texture with complex shadow
</div>
```

---

## 💡 Pro Tips

### 1. **Use Template Literals for Conditionals**
```tsx
<button className={`px-4 py-2 rounded ${
  isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
}`}>
  Click me
</button>
```

### 2. **Install `clsx` for Cleaner Code**
```bash
npm install clsx
```

```tsx
import clsx from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded transition-all',
  isActive && 'bg-green-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  Click me
</button>
```

### 3. **Arbitrary Values for Custom Sizes**
```tsx
// Any custom value in brackets
<div className="text-[0.55rem] bg-[#8c5d41] border-[6px] w-[280px]">
  Custom sizing
</div>
```

### 4. **Combine with Inline Styles for Complex Effects**
```tsx
<div 
  className="p-6 bg-white rounded-lg shadow-lg" 
  style={{
    backgroundImage: 'url(...)',
    textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
  }}
>
  Combined approach
</div>
```

### 5. **Mobile-First Responsive Design**
```tsx
// Default (mobile): small
// sm (640px+): medium
// md (768px+): larger
// lg (1024px+): large
<div className="text-xs sm:text-sm md:text-base lg:text-lg">
  Responsive text sizing
</div>
```

---

## 🔍 When to Use What

| Situation | Use |
|-----------|-----|
| Simple styling (buttons, forms) | Tailwind classes |
| Complex multi-shadow effects | Inline `style` prop |
| Text shadows or special effects | Inline `style` prop |
| Dynamic classes | Template literals or `clsx` |
| Animation keyframes | `animate-shellIn`, `animate-contentFade` |
| Game-specific complex layouts | Can use CSS module if needed |

---

## ⚡ Performance Benefits

```
CSS Modules:    styles.css (separate file) + styles.module.css files
                ↓
                Bundler creates multiple CSS chunks
                ↓
                Users download more files

Tailwind:       Utility classes in JSX
                ↓
                Single CSS file with only used classes
                ↓
                Smaller total bundle size
```

---

## ✅ Checklist: Ready to Build with Tailwind?

- [ ] Read through this file
- [ ] Glance at `TAILWIND_CHEATSHEET.md` for reference
- [ ] Check `TAILWIND_SETUP_SUMMARY.md` for examples
- [ ] Open AssessmentShell.tsx to see working example
- [ ] Start building your first component with Tailwind
- [ ] Ask in the documentation if you need help

---

## ❓ Quick FAQ

**Q: I don't know the Tailwind class for something?**  
A: Check `TAILWIND_CHEATSHEET.md` or visit https://tailwindcss.com/docs

**Q: How do I use a custom color not in Tailwind?**  
A: Use arbitrary values: `bg-[#8c5d41]`, `text-[#DD1A21]`

**Q: Can I still use CSS modules?**  
A: Yes, but try Tailwind first—it's faster for most cases.

**Q: How do I add hover effects?**  
A: Use `hover:` prefix: `hover:bg-blue-600`, `hover:opacity-80`

**Q: What's the spacing scale?**  
A: Tailwind uses 4px: `p-1` (4px), `p-6` (24px), `gap-7` (28px)

---

## 🎓 Learning Path

1. **Today**: Build your first form with Tailwind (30 min)
2. **Tomorrow**: Migrate a simple component (1 hour)
3. **This Week**: Migrate 3-5 components (2-3 hours)
4. **This Month**: All new components use Tailwind

---

## 🚀 Next Component Candidates

Easy to migrate (start here):
- [ ] Login/Sign-up forms
- [ ] Simple buttons
- [ ] Cards and containers
- [ ] Navigation menus

Medium complexity:
- [ ] Multi-step forms (like AssessmentShell ✓)
- [ ] Modals and dialogs
- [ ] Dropdowns and selects

Complex (optional):
- [ ] Game-specific components
- [ ] Custom canvas elements
- [ ] Special animated sequences

---

## 📞 Need Help?

1. Check `TAILWIND_CHEATSHEET.md` for quick lookup
2. Read `TAILWIND_MIGRATION_GUIDE.md` for detailed steps
3. Review `AssessmentShell.tsx` for working example
4. Visit https://tailwindcss.com/docs for official docs
5. Try https://play.tailwindcss.com/ to experiment

---

**Happy styling! Remember: Tailwind makes you faster, not just different. 🎨**
