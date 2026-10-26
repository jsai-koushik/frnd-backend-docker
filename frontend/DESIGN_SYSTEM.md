# 🎨 SmartHire Design System

## Overview

A comprehensive, modern UI design system for the SmartHire platform featuring premium components, consistent styling, and professional aesthetics.

---

## 📁 File Structure

```
src/
├── styles/
│   ├── design-system.css     # Core design tokens & utilities
│   └── components.css         # Reusable component library
├── index.css                  # Global styles & base setup
└── pages/
    ├── admin/
    │   └── AdminDashboard.css
    ├── auth/
    │   └── Auth.css
    └── candidate/
        └── CandidateProfile.css
```

---

## 🎨 Design Tokens

### Color Palette

#### Primary Colors (Indigo/Purple)
- `--primary-500`: #6366f1
- `--primary-600`: #4f46e5
- `--primary-700`: #4338ca

#### Secondary Colors (Purple)
- `--secondary-500`: #a855f7
- `--secondary-600`: #9333ea

#### Neutral Colors
- `--gray-50` to `--gray-900`

#### Status Colors
- **Success**: `--success-500` (#10b981)
- **Warning**: `--warning-500` (#f97316)
- **Error**: `--error-500` (#ef4444)
- **Info**: `--info-500` (#3b82f6)

### Gradients

```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-success: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
--gradient-sunset: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
```

### Spacing Scale

```
--spacing-xs: 0.25rem    (4px)
--spacing-sm: 0.5rem     (8px)
--spacing-md: 1rem       (16px)
--spacing-lg: 1.5rem     (24px)
--spacing-xl: 2rem       (32px)
--spacing-2xl: 3rem      (48px)
--spacing-3xl: 4rem      (64px)
```

### Typography

```
--text-xs: 0.75rem       (12px)
--text-sm: 0.875rem      (14px)
--text-base: 1rem        (16px)
--text-lg: 1.125rem      (18px)
--text-xl: 1.25rem       (20px)
--text-2xl: 1.5rem       (24px)
--text-3xl: 1.875rem     (30px)
--text-4xl: 2.25rem      (36px)
--text-5xl: 3rem         (48px)
```

### Border Radius

```
--radius-sm: 0.375rem    (6px)
--radius-md: 0.5rem      (8px)
--radius-lg: 0.75rem     (12px)
--radius-xl: 1rem        (16px)
--radius-2xl: 1.25rem    (20px)
--radius-3xl: 1.5rem     (24px)
--radius-full: 9999px
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-glow: 0 0 20px rgba(102, 126, 234, 0.4);
```

---

## 🧩 Component Library

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Click Me</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Cancel</button>

<!-- Success Button -->
<button class="btn btn-success">Save</button>

<!-- Danger Button -->
<button class="btn btn-danger">Delete</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">More Options</button>

<!-- Size Variants -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>

<!-- Icon Button -->
<button class="btn btn-icon btn-primary">
  <Icon />
</button>
```

### Cards

```html
<!-- Basic Card -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>

<!-- Compact Card -->
<div class="card card-compact">
  <p>Less padding</p>
</div>

<!-- Elevated Card -->
<div class="card card-elevated">
  <p>More shadow depth</p>
</div>
```

### Inputs

```html
<!-- Text Input -->
<div class="form-group">
  <label class="form-label">Email Address</label>
  <input type="email" class="input" placeholder="Enter email" />
  <span class="form-hint">We'll never share your email</span>
</div>

<!-- Input with Error -->
<div class="form-group">
  <label class="form-label">Password</label>
  <input type="password" class="input input-error" />
  <span class="form-error">Password is required</span>
</div>

<!-- Textarea -->
<textarea class="input textarea" rows="5"></textarea>

<!-- Select -->
<select class="input select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-info">Info</span>
<span class="badge badge-gray">Gray</span>
```

### Alerts

```html
<!-- Success Alert -->
<div class="alert alert-success">
  <Icon />
  <p>Operation completed successfully!</p>
</div>

<!-- Error Alert -->
<div class="alert alert-error">
  <Icon />
  <p>An error occurred</p>
</div>

<!-- Warning Alert -->
<div class="alert alert-warning">
  <Icon />
  <p>Warning message</p>
</div>

<!-- Info Alert -->
<div class="alert alert-info">
  <Icon />
  <p>Informational message</p>
</div>
```

### Loading States

```html
<!-- Spinner -->
<div class="spinner"></div>
<div class="spinner spinner-sm"></div>
<div class="spinner spinner-lg"></div>

<!-- Skeleton Loaders -->
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-heading"></div>
<div class="skeleton skeleton-card"></div>
```

### Status Indicators

```html
<div class="status-indicator status-pending">
  <span class="status-indicator-dot"></span>
  Pending
</div>

<div class="status-indicator status-active">
  <span class="status-indicator-dot"></span>
  Active
</div>

<div class="status-indicator status-completed">
  <span class="status-indicator-dot"></span>
  Completed
</div>

<div class="status-indicator status-rejected">
  <span class="status-indicator-dot"></span>
  Rejected
</div>
```

### Data Tables

```html
<div class="data-table-wrapper">
  <table class="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td><span class="badge badge-success">Active</span></td>
        <td>
          <button class="table-action-btn table-action-btn-primary">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modal/Dialog

```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button class="modal-close-btn">×</button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Tabs

```html
<div class="tabs-container">
  <div class="tabs-list">
    <button class="tab-button active">Tab 1</button>
    <button class="tab-button">Tab 2</button>
    <button class="tab-button">Tab 3</button>
  </div>
  <div class="tab-content">
    <p>Tab 1 content</p>
  </div>
</div>
```

### Empty State

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <Icon size={48} />
  </div>
  <h3 class="empty-state-title">No Data Found</h3>
  <p class="empty-state-description">
    There are no items to display at the moment.
  </p>
  <button class="btn btn-primary">Create New</button>
</div>
```

---

## 🎯 Utility Classes

### Layout

```html
<!-- Container -->
<div class="container">Default container (1280px)</div>
<div class="container container-sm">Small (640px)</div>
<div class="container container-md">Medium (768px)</div>
<div class="container container-lg">Large (1024px)</div>

<!-- Grid -->
<div class="grid grid-cols-2">Two columns</div>
<div class="grid grid-cols-3">Three columns</div>
<div class="grid grid-cols-4">Four columns</div>

<!-- Flexbox -->
<div class="flex items-center justify-between gap-md">
  Flex container
</div>
```

### Spacing

```html
<!-- Margins -->
<div class="mt-sm">margin-top: 8px</div>
<div class="mb-md">margin-bottom: 16px</div>
<div class="mt-lg">margin-top: 24px</div>

<!-- Padding -->
<div class="p-sm">padding: 8px</div>
<div class="p-md">padding: 16px</div>
<div class="p-lg">padding: 24px</div>
```

### Text

```html
<p class="text-center">Centered text</p>
<p class="text-right">Right aligned</p>
<p class="font-bold">Bold text</p>
<p class="font-semibold">Semi-bold text</p>
<p class="text-muted">Muted text color</p>
```

### Animations

```html
<div class="animate-fade-in">Fades in</div>
<div class="animate-fade-in-up">Fades in from bottom</div>
<div class="animate-scale-in">Scales in</div>
```

---

## 🚀 Usage Examples

### Import in Your Components

```javascript
// For page-specific styles
import './AdminDashboard.css';

// Or for component library
import '../../styles/components.css';
```

### Using in React/JSX

```jsx
function MyComponent() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back!</p>
        </div>

        <div className="grid grid-cols-3">
          <div className="card">
            <h3>Card 1</h3>
          </div>
          <div className="card">
            <h3>Card 2</h3>
          </div>
          <div className="card">
            <h3>Card 3</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📱 Responsive Design

All components are fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Components automatically adapt to screen sizes with:
- Flexible grids
- Responsive typography
- Touch-friendly interactions
- Mobile-optimized layouts

---

## ♿ Accessibility

The design system includes:

- ✅ Proper focus states
- ✅ ARIA-compliant markup
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Reduced motion support
- ✅ High contrast ratios (WCAG AA+)

---

## 🎨 Customization

### Changing Primary Colors

Update the CSS variables in `design-system.css`:

```css
:root {
  --primary-500: #your-color;
  --primary-600: #your-darker-color;
}
```

### Creating Custom Gradients

```css
.my-custom-gradient {
  background: linear-gradient(135deg, #start-color 0%, #end-color 100%);
}
```

---

## 📦 What's Included

### ✅ Completed

1. **Core Design System** (`design-system.css`)
   - Color tokens
   - Typography scale
   - Spacing system
   - Shadows & effects
   - Transitions

2. **Component Library** (`components.css`)
   - Data tables
   - Modals/Dialogs
   - Dropdowns
   - Tabs
   - Pagination
   - Breadcrumbs
   - Tooltips
   - Progress bars
   - Empty states
   - File uploads
   - Search bars

3. **Page-Specific Styles**
   - Admin Dashboard (premium cards, gradient header)
   - Auth Pages (login/register with animated backgrounds)
   - Candidate Profile (profile cards, forms)

4. **Global Styles** (`index.css`)
   - Base typography
   - Form elements
   - Custom scrollbar
   - Selection colors
   - Print styles

---

## 🌟 Features

- **Modern Aesthetics**: Gradient effects, smooth animations
- **Professional**: Clean, corporate-friendly design
- **Consistent**: Unified design language throughout
- **Performant**: Optimized CSS, minimal overhead
- **Accessible**: WCAG compliant components
- **Responsive**: Mobile-first approach
- **Customizable**: Easy to theme and extend

---

## 📝 Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Prefer utility classes** for simple styling
3. **Use component classes** for complex, reusable patterns
4. **Follow the spacing scale** for consistent layouts
5. **Test on multiple devices** before deployment
6. **Maintain accessibility** standards

---

## 🔥 Next Steps

To apply this design system across your entire project:

1. Import the design system in your main CSS file
2. Update existing components to use new utility classes
3. Replace inline styles with design system classes
4. Test across all pages and components
5. Customize colors/branding as needed

---

## 💡 Tips

- Use browser DevTools to inspect CSS variables
- Combine utility classes for quick prototyping
- Create custom components by extending base classes
- Keep design tokens centralized for easy updates
- Document any custom additions

---

## 🆘 Support

For questions or issues:
1. Check the design system CSS files
2. Review component examples above
3. Inspect existing implementations
4. Refer to utility class documentation

---

**Built with ❤️ for SmartHire Platform**
