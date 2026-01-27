# Portfolio Templates - ZestFolio

This directory contains all portfolio templates for the ZestFolio platform. Each template is a standalone HTML file that can be customized with user data.

---

## 📁 Directory Structure

```
portfolio_templates/
├── template01/
│   └── index.html
├── template02/
│   └── index.html
├── template03/
│   └── index.html
├── ...
└── README.md (this file)
```

---

## 🎨 Existing Templates

| Template | Theme | Primary Color | Description |
|----------|-------|---------------|-------------|
| **template01** | Tech/Systems | Green (#0df20d) | Dark theme with neon green accents |
| **template02** | Professional | Green (#0df20d) | Clean, centered layout |
| **template03** | Data Analyst | Blue (#1337ec) | Modern data-focused design |
| **template04** | Modern | Primary | Light/dark mode support |
| **template05** | Minimal | Blue (#1337ec) | Simple, compact layout |
| **template06** | Hardware Engineer | Primary | Retro-inspired design |
| **template07** | Creative | Primary | Bold, artistic layout |
| **template08** | Architecture | Primary | Professional architecture theme |
| **template09** | Research | Blue (#1337ec) | Academic/scholarly design |

---

## 🆕 Creating a New Template

### Step 1: Create Template Directory

```bash
mkdir portfolio_templates/template10
```

### Step 2: Create index.html

Create `portfolio_templates/template10/index.html` with your template design.

### Step 3: Add Required Data Injection Points

Every template **MUST** include these ID attributes for data injection:

#### **Profile/Hero Section:**
```html
<div id="portfolio-hero-image" style="background-image: url('...');"></div>
<h1 id="portfolio-name">Name</h1>
<p id="portfolio-title">Job Title</p>
<p id="portfolio-bio">Bio/Description</p>
```

#### **Projects Section:**
```html
<h2 id="portfolio-projects-header">Projects</h2>
<div id="portfolio-projects">
  <!-- Projects will be injected here -->
</div>
```

#### **Skills Section:**
```html
<h2 id="portfolio-skills-header">Skills</h2>
<div id="portfolio-skills">
  <!-- Skills will be injected here -->
</div>
```

#### **Education Section (Optional but Recommended):**
```html
<h2 id="portfolio-education-header">Education</h2>
<div id="portfolio-education">
  <!-- Education will be injected here -->
</div>
```

#### **Social Links:**
```html
<a id="social-github" href="#">GitHub</a>
<a id="social-linkedin" href="#">LinkedIn</a>
<a id="social-twitter" href="#">Twitter</a>
<a id="social-website" href="#">Website</a>
<a id="social-email" href="mailto:">Email</a>
<input id="portfolio-email" type="email" />
```

---

## ⚠️ MANDATORY: ZestFolio Credits & CTA Section

**Every template MUST include the ZestFolio credits and call-to-action section at the bottom.**

### Required Section:

Add this code **before the closing `</body>` tag** in every template:

```html
<!-- ZestFolio Credits & CTA -->
<div class="w-full border-t border-[YOUR_BORDER_COLOR] bg-[YOUR_BG_COLOR] py-8 px-4 mt-10">
  <div class="max-w-[960px] mx-auto text-center space-y-4">
    <p class="text-[YOUR_TEXT_COLOR] text-sm">
      Portfolio created with <span class="text-[YOUR_ACCENT_COLOR] font-bold">ZestFolio</span>
    </p>
    <div class="space-y-3">
      <p class="text-[YOUR_HEADING_COLOR] text-lg font-semibold">
        Want to create your portfolio right now?
      </p>
      <a href="https://zestfolio.vercel.app/" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-8 py-3 bg-[YOUR_PRIMARY_COLOR] text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg">
        Click Here Now
      </a>
    </div>
  </div>
</div>
```

### Color Customization Guide:

Replace the placeholder colors with your template's theme:

- `[YOUR_BORDER_COLOR]` - Border color (e.g., `#282b39`, `gray-200`)
- `[YOUR_BG_COLOR]` - Background color (e.g., `#0a0a0f`, `gray-50`)
- `[YOUR_TEXT_COLOR]` - Muted text color (e.g., `#9da1b9`, `gray-600`)
- `[YOUR_ACCENT_COLOR]` - Brand/accent color (e.g., `#1337ec`, `#0df20d`)
- `[YOUR_HEADING_COLOR]` - Heading text color (e.g., `white`, `gray-900`)
- `[YOUR_PRIMARY_COLOR]` - Primary button color (e.g., `#1337ec`, `#0df20d`)

### Examples from Existing Templates:

**Dark Theme (Template01):**
```html
<div class="w-full border-t border-[#283928] bg-[#0a0f0a] py-8 px-4 mt-10">
  <div class="max-w-[960px] mx-auto text-center space-y-4">
    <p class="text-[#9cba9c] text-sm">
      Portfolio created with <span class="text-[#0df20d] font-bold">ZestFolio</span>
    </p>
    <div class="space-y-3">
      <p class="text-white text-lg font-semibold">
        Want to create your portfolio right now?
      </p>
      <a href="https://zestfolio.vercel.app/" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-8 py-3 bg-[#0df20d] text-[#111811] text-sm font-bold rounded-lg hover:bg-[#0bf00b] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(13,242,13,0.5)]">
        Click Here Now
      </a>
    </div>
  </div>
</div>
```

**Light/Dark Theme (Template04):**
```html
<div class="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
  <div class="max-w-[1200px] mx-auto text-center space-y-4">
    <p class="text-gray-600 dark:text-gray-400 text-sm">
      Portfolio created with <span class="text-primary font-bold">ZestFolio</span>
    </p>
    <div class="space-y-3">
      <p class="text-gray-900 dark:text-white text-lg font-semibold">
        Want to create your portfolio right now?
      </p>
      <a href="https://zestfolio.vercel.app/" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg">
        Click Here Now
      </a>
    </div>
  </div>
</div>
```

---

## 🎯 Template Design Guidelines

### 1. **Responsive Design**
- Must work on mobile, tablet, and desktop
- Use Tailwind CSS responsive classes (`sm:`, `md:`, `lg:`)
- Test on different screen sizes

### 2. **Color Scheme**
- Choose a cohesive color palette
- Ensure good contrast for readability
- Support dark mode if possible

### 3. **Typography**
- Use web-safe or Google Fonts
- Maintain readable font sizes (min 14px for body text)
- Use proper heading hierarchy (h1, h2, h3)

### 4. **Performance**
- Minimize external dependencies
- Use CDN for libraries (Tailwind, fonts)
- Optimize images and assets

### 5. **Accessibility**
- Use semantic HTML
- Include alt text for images
- Ensure keyboard navigation works
- Maintain WCAG 2.1 AA standards

---

## 🔧 Technical Requirements

### Required Technologies:
- **HTML5** - Semantic markup
- **Tailwind CSS** - Via CDN for styling
- **Vanilla JavaScript** - If needed (minimal)

### CDN Links:
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<!-- Google Fonts (optional) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Material Symbols (optional) -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
```

---

## 📝 Template Registration

After creating a new template, register it in the system:

### 1. Update `src/lib/templates.ts`

Add your template to the `PORTFOLIO_TEMPLATES` array:

```typescript
{
  id: 'template10',
  name: 'Template Name',
  description: 'Brief description of the template',
  thumbnail: '/templates/template10-preview.png',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  category: 'professional' // or 'creative', 'minimal', 'technical'
}
```

### 2. Create Thumbnail

- Create a preview image: `public/templates/template10-preview.png`
- Recommended size: 1200x675px (16:9 ratio)
- Show the template's hero section and key features

### 3. Test Data Injection

Ensure the API route (`src/app/api/portfolio/[username]/route.ts`) correctly injects data into your template.

---

## 🧪 Testing Checklist

Before submitting a new template, verify:

- [ ] All required ID attributes are present
- [ ] ZestFolio Credits & CTA section is included
- [ ] Responsive design works on all screen sizes
- [ ] Data injection points work correctly
- [ ] Social links are functional
- [ ] Colors and typography are consistent
- [ ] No console errors
- [ ] Template is registered in `templates.ts`
- [ ] Thumbnail image is created
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

---

## 📊 Data Injection Flow

```
User Data (Firestore)
        ↓
API Route (route.ts)
        ↓
Cheerio (HTML manipulation)
        ↓
Template (index.html)
        ↓
Final Portfolio Page
```

The API route uses Cheerio to:
1. Load the template HTML
2. Find elements by ID
3. Inject user data
4. Return the customized HTML

---

## 🎨 Design Inspiration

### Good Template Characteristics:
- ✅ Clean, modern design
- ✅ Clear visual hierarchy
- ✅ Professional appearance
- ✅ Easy to scan and read
- ✅ Unique personality
- ✅ Mobile-first approach

### Avoid:
- ❌ Cluttered layouts
- ❌ Poor contrast/readability
- ❌ Excessive animations
- ❌ Broken responsive design
- ❌ Missing accessibility features

---

## 📚 Resources

### Design Inspiration:
- [Dribbble - Portfolio Designs](https://dribbble.com/tags/portfolio)
- [Behance - Portfolio Projects](https://www.behance.net/search/projects?search=portfolio)
- [Awwwards - Portfolio Websites](https://www.awwwards.com/websites/portfolio/)

### Tailwind CSS:
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)

### Color Palettes:
- [Coolors](https://coolors.co/)
- [Adobe Color](https://color.adobe.com/)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)

---

## 🚀 Quick Start: New Template

```bash
# 1. Create directory
mkdir portfolio_templates/template10

# 2. Create HTML file
touch portfolio_templates/template10/index.html

# 3. Add boilerplate with required IDs and CTA section

# 4. Register in templates.ts

# 5. Create thumbnail

# 6. Test with sample data

# 7. Deploy!
```

---

## 📞 Support

For questions or issues with templates:
- Check existing templates for reference
- Review the API route for data injection logic
- Test with the dashboard preview feature
- Ensure all required elements are present

---

## 📄 License

All templates are part of the ZestFolio project and follow the project's license.

---

**Last Updated:** 2026-01-28

**Total Templates:** 9

**Next Template ID:** template10

---

## 🎯 Remember

**Every template MUST include the ZestFolio Credits & CTA section!**

This is mandatory for brand consistency and driving traffic to the main platform.
