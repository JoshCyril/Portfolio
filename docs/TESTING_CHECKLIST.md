# Testing Checklist

## 🚀 Quick Test Guide

### 1. Development Server
- [ ] Server starts without errors
- [ ] No console errors in browser
- [ ] Page loads correctly

### 2. Scroll Progress Indicator
- [ ] Progress bar appears at top of page
- [ ] Progress bar updates as you scroll
- [ ] Progress bar disappears when `prefers-reduced-motion` is enabled

### 3. Hero Section (Main)
- [ ] Avatar scales in on page load
- [ ] "Hello," text fades in
- [ ] Name section fades in after greeting
- [ ] Tagline fades in
- [ ] Social links stagger in sequentially
- [ ] Location badge fades in

### 4. Navigation Bar
- [ ] Navbar slides in from top on page load
- [ ] Navbar hides when scrolling down
- [ ] Navbar shows when scrolling up
- [ ] Logo button scrolls to top when on homepage
- [ ] Theme toggle rotates on theme change
- [ ] All navigation links work

### 5. Projects Section
- [ ] Section title fades up on scroll
- [ ] Project cards stagger in (fade-up animation)
- [ ] Cards have 3D tilt effect on hover
- [ ] Project images have parallax effect on hover
- [ ] Button clicks show ripple effect
- [ ] View and external link buttons work

### 6. About Section
- [ ] Section title fades up on scroll
- [ ] Content block fades in
- [ ] Graph chart fades in
- [ ] Skill tags stagger in sequentially
- [ ] Tooltips work on skill tags

### 7. Experience Section (E3)
- [ ] "Experiences" title fades up
- [ ] Experience cards stagger in
- [ ] "Education" title fades up
- [ ] Education cards stagger in
- [ ] "Expertise" title fades up
- [ ] Expertise items stagger in

### 8. Footer
- [ ] Footer fades in on scroll
- [ ] Copyright and update date display correctly

### 9. Smooth Scrolling
- [ ] Clicking logo scrolls smoothly to top
- [ ] Scroll behavior is smooth (not jarring)
- [ ] Scroll works with reduced motion preference

### 10. Performance
- [ ] Animations run at 60fps (check in browser dev tools)
- [ ] No janky animations
- [ ] Page doesn't lag during scroll
- [ ] Animations don't cause layout shifts

### 11. Accessibility
- [ ] Animations respect `prefers-reduced-motion`
  - Test: Enable reduced motion in OS settings
  - Animations should be instant or disabled
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Screen reader compatibility (test with NVDA/JAWS)

### 12. Responsive Design
- [ ] Animations work on mobile (test on phone or dev tools)
- [ ] Animations work on tablet
- [ ] Animations work on desktop
- [ ] No horizontal scroll issues
- [ ] Touch interactions work (for mobile)

### 13. Browser Compatibility
- [ ] Chrome/Edge - All animations work
- [ ] Firefox - All animations work
- [ ] Safari - All animations work
- [ ] Mobile browsers - Animations work

### 14. Theme Toggle
- [ ] Theme toggle rotates on click
- [ ] Smooth transition between light/dark themes
- [ ] All animations work in both themes
- [ ] No flash of unstyled content

### 15. Edge Cases
- [ ] Rapid scrolling doesn't break animations
- [ ] Switching tabs and coming back works
- [ ] Resizing window doesn't break animations
- [ ] Multiple rapid clicks don't cause issues
- [ ] Long pages scroll smoothly

## 🐛 Common Issues to Check

### If animations don't work:
1. Check browser console for errors
2. Verify GSAP is installed: `npm list gsap`
3. Check if `prefers-reduced-motion` is enabled
4. Verify animations are enabled in browser dev tools

### If performance is poor:
1. Check GPU acceleration is enabled
2. Verify will-change is being set correctly
3. Check for too many simultaneous animations
4. Test on different devices

### If animations are too fast/slow:
1. Adjust timing in `app/lib/animations.ts`
2. Modify `animationConfig.duration`
3. Change individual component delays

## 📊 Performance Metrics to Check

### Lighthouse Scores
- [ ] Performance: 90+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

### Browser DevTools
- [ ] FPS stays at 60 during animations
- [ ] No layout shifts (CLS)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

## 🧪 Testing Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

## 📝 Notes

- Test on actual devices when possible (not just browser dev tools)
- Test with different network speeds
- Test with different screen sizes
- Test with accessibility tools
- Test with reduced motion enabled

## ✅ Post-Testing

After testing, note any issues:
- [ ] Performance issues
- [ ] Animation glitches
- [ ] Browser compatibility issues
- [ ] Accessibility issues
- [ ] Mobile-specific issues
