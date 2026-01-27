# Quick Reference: Template Requirements

## ✅ Mandatory Checklist for New Templates

### 1. Required ID Attributes

```html
<!-- Profile/Hero -->
<div id="portfolio-hero-image"></div>
<h1 id="portfolio-name"></h1>
<p id="portfolio-title"></p>
<p id="portfolio-bio"></p>

<!-- Projects -->
<h2 id="portfolio-projects-header"></h2>
<div id="portfolio-projects"></div>

<!-- Skills -->
<h2 id="portfolio-skills-header"></h2>
<div id="portfolio-skills"></div>

<!-- Education (Optional) -->
<h2 id="portfolio-education-header"></h2>
<div id="portfolio-education"></div>

<!-- Social Links -->
<a id="social-github" href="#"></a>
<a id="social-linkedin" href="#"></a>
<a id="social-twitter" href="#"></a>
<a id="social-website" href="#"></a>
<a id="social-email" href="mailto:"></a>
<input id="portfolio-email" />
```

### 2. ZestFolio CTA Section (MANDATORY)

**Location:** Before `</body>` tag

**Template:**
```html
<!-- ZestFolio Credits & CTA -->
<div class="w-full border-t border-[COLOR] bg-[COLOR] py-8 px-4 mt-10">
  <div class="max-w-[960px] mx-auto text-center space-y-4">
    <p class="text-[COLOR] text-sm">
      Portfolio created with <span class="text-[ACCENT] font-bold">ZestFolio</span>
    </p>
    <div class="space-y-3">
      <p class="text-[COLOR] text-lg font-semibold">
        Want to create your portfolio right now?
      </p>
      <a href="https://zestfolio.vercel.app/" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-8 py-3 bg-[PRIMARY] text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg">
        Click Here Now
      </a>
    </div>
  </div>
</div>
```

### 3. Section IDs for Navigation (Recommended)

Add IDs to main sections for smooth scrolling:

```html
<section id="home">Hero content</section>
<section id="projects">Projects content</section>
<section id="skills">Skills content</section>
<section id="education">Education content</section>
<section id="contact">Contact content</section>
```

### 4. Navigation Links

Update navigation to use hash links:

```html
<nav>
  <a href="#home">Home</a>
  <a href="#projects">Projects</a>
  <a href="#skills">Skills</a>
  <a href="#contact">Contact</a>
</nav>
```

### 5. Smooth Scroll Script (Optional)

Add before `</body>`:

```html
<script>
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
</script>
```

---

## 📋 Pre-Launch Checklist

- [ ] All required IDs present
- [ ] ZestFolio CTA section added
- [ ] Section IDs for navigation
- [ ] Navigation links updated
- [ ] Smooth scroll implemented
- [ ] Responsive design tested
- [ ] Template registered in `templates.ts`
- [ ] Thumbnail created
- [ ] Cross-browser tested

---

## 🎨 Color Customization Examples

**Dark Theme:**
- Border: `#283928`, `#282b39`, `#3b3f54`
- Background: `#0a0f0a`, `#0a0a0f`, `#111218`
- Text: `#9cba9c`, `#9da1b9`, `gray-400`
- Accent: `#0df20d`, `#1337ec`, `primary`

**Light Theme:**
- Border: `gray-200`, `slate-200`
- Background: `gray-50`, `slate-50`, `white`
- Text: `gray-600`, `slate-600`
- Accent: `primary`, `blue-600`

---

## 🚀 Quick Copy-Paste

**CTA for Dark Themes:**
```html
<div class="w-full border-t border-[#282b39] bg-[#0a0a0f] py-8 px-4 mt-10">
  <div class="max-w-[960px] mx-auto text-center space-y-4">
    <p class="text-[#9da1b9] text-sm">
      Portfolio created with <span class="text-[#1337ec] font-bold">ZestFolio</span>
    </p>
    <div class="space-y-3">
      <p class="text-white text-lg font-semibold">
        Want to create your portfolio right now?
      </p>
      <a href="https://zestfolio.vercel.app/" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-8 py-3 bg-[#1337ec] text-white text-sm font-bold rounded-lg hover:bg-[#1028c0] transition-all duration-300 shadow-lg">
        Click Here Now
      </a>
    </div>
  </div>
</div>
```

**CTA for Light/Dark Themes:**
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

**Remember:** The ZestFolio CTA is MANDATORY for all templates!
