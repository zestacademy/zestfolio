# ZestFolio - Student Portfolio Platform

ZestFolio is a dynamic portfolio building platform designed for engineering students, freshers, and self-learners to create professional, shareable portfolios in under 10 minutes without coding. It leverages Next.js, Firebase, and Tailwind CSS to provide a premium, responsive, and secure experience.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Components](#-components)
- [API Routes](#-api-routes)
- [Getting Started](#-getting-started)
- [System Updates](#-system-updates-change-log)
- [Security](#-security)
- [Contributing](#-contributing)

## 🚀 Features

### **For Students (Users)**
*   **Dynamic Portfolio Generation**: Create a stunning portfolio in minutes.
*   **Theme Selection**: Choose from multiple professionally designed templates (Modern, Creative, Minimalist, etc.).
*   **Project Showcase**: Add projects with images, descriptions, and links.
*   **Skill Management**: Visual skill tags with automatic icon mapping.
*   **Education Timeline**: Organize academic history chronologically.
*   **Profile Management**: Update personal details, social links, and profile photos.
*   **Status Control**: Manually "Pause" your portfolio to hide it from the public (Maintenance Mode).

### **For Administrators**
*   **Admin Dashboard**: Comprehensive overview of all users.
*   **Real-Time Monitoring**: Track Total Users, Active Portfolios, and Average Projects per user.
*   **User Management**: View user details including Full Name, URL Name (Username), and Portfolio Status.
*   **Search**: Filter users by Full Name, URL Name, or Email.
*   **Status Indicators**: Quickly identify portfolios that are **Live** (Green), **Paused** (Amber), or **Draft** (Gray).

## 📁 Project Structure

```
zestfolio/
├── src/                                # Source code directory
│   ├── app/                           # Next.js App Router (pages & layouts)
│   │   ├── page.tsx                   # Landing/home page
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── globals.css                # Global styles & Tailwind imports
│   │   ├── robots.ts                  # SEO robots.txt configuration
│   │   ├── sitemap.ts                 # Dynamic sitemap generation
│   │   ├── not-found.tsx              # 404 error page
│   │   │
│   │   ├── login/                     # Authentication pages
│   │   │   └── page.tsx               # SSO & Google OAuth login
│   │   ├── signup/                    
│   │   │   └── page.tsx               # User registration
│   │   │
│   │   ├── dashboard/                 # Protected dashboard routes
│   │   │   ├── layout.tsx             # Dashboard layout with sidebar
│   │   │   ├── page.tsx               # Dashboard overview
│   │   │   ├── profile/page.tsx       # Profile management
│   │   │   ├── projects/page.tsx      # Project CRUD operations
│   │   │   ├── skills/page.tsx        # Skills management
│   │   │   ├── education/page.tsx     # Education timeline
│   │   │   ├── templates/page.tsx     # Template selection
│   │   │   └── settings/page.tsx      # Portfolio settings & privacy
│   │   │
│   │   ├── admin/                     # Admin-only routes
│   │   │   └── page.tsx               # Admin dashboard
│   │   │
│   │   ├── u/[username]/              # Public portfolio pages
│   │   │   └── page.tsx               # Dynamic user portfolio renderer
│   │   │
│   │   ├── preview/                   # Portfolio preview
│   │   │   └── page.tsx               # Live preview before publishing
│   │   │
│   │   ├── templates/                 # Template gallery
│   │   │   └── page.tsx               # Browse all templates
│   │   ├── features/                  # Feature showcase
│   │   │   └── page.tsx               # Platform features page
│   │   ├── examples/                  # Example portfolios
│   │   │   └── page.tsx               # Sample portfolio showcase
│   │   │
│   │   ├── privacy-policy/            # Legal pages
│   │   │   └── page.tsx               
│   │   ├── terms-conditions/          
│   │   │   └── page.tsx               
│   │   │
│   │   └── api/                       # API routes (server-side)
│   │       ├── parse-resume/route.ts  # Resume parsing endpoint
│   │       ├── portfolio/[username]/route.ts  # Portfolio fetch API
│   │       └── templates/[templateId]/route.ts # Template data API
│   │
│   ├── components/                    # Reusable React components
│   │   ├── forms/                     # Form components
│   │   │   ├── profile-form.tsx       # Profile information form
│   │   │   ├── projects-form.tsx      # Project management form
│   │   │   ├── skills-form.tsx        # Skills editor form
│   │   │   └── education-form.tsx     # Education history form
│   │   │
│   │   ├── dashboard/                 # Dashboard-specific components
│   │   │   ├── sidebar.tsx            # Navigation sidebar
│   │   │   ├── user-profile.tsx       # User profile widget
│   │   │   └── resume-parser.tsx      # Resume upload & auto-fill
│   │   │
│   │   ├── templates/                 # Portfolio templates
│   │   │   ├── template-renderer.tsx  # Dynamic template selector
│   │   │   ├── minimal-template.tsx   # Minimalist design template
│   │   │   └── modern-template.tsx    # Modern professional template
│   │   │
│   │   ├── ui/                        # Shadcn UI components
│   │   │   ├── button.tsx             # Button component with variants
│   │   │   ├── input.tsx              # Text input field
│   │   │   ├── card.tsx               # Card container
│   │   │   ├── dialog.tsx             # Modal dialog
│   │   │   ├── label.tsx              # Form label
│   │   │   ├── badge.tsx              # Badge/tag component
│   │   │   ├── alert.tsx              # Alert/notification
│   │   │   └── switch.tsx             # Toggle switch
│   │   │
│   │   ├── navbar.tsx                 # Top navigation bar
│   │   ├── footer.tsx                 # Footer component
│   │   └── theme-toggle.tsx           # Dark/light mode switcher
│   │
│   ├── lib/                           # Utility functions & configs
│   │   ├── firebase.ts                # Firebase client SDK initialization
│   │   ├── firebase-admin.ts          # Firebase Admin SDK (server-side)
│   │   ├── auth-context.tsx           # Authentication context provider
│   │   ├── theme-context.tsx          # Theme state management
│   │   ├── cookie-utils.ts            # Cookie handling utilities
│   │   ├── templates.ts               # Template configurations
│   │   └── utils.ts                   # General helper functions
│   │
│   ├── constants/                     # Constants & static data
│   │   └── mock-data.ts               # Mock data for examples
│   │
│   └── types/                         # TypeScript type definitions
│       └── index.ts                   # Shared type interfaces
│
├── public/                            # Static assets (images, fonts)
├── portfolio_templates/               # Template-specific assets
│
├── components.json                    # Shadcn UI configuration
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── postcss.config.mjs                 # PostCSS configuration
├── eslint.config.mjs                  # ESLint configuration
├── package.json                       # Dependencies & scripts
├── firestore.rules                    # Firestore security rules
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules
└── README.md                          # This file
```

## 🛠 Tech Stack

### Core Technologies

#### **Frontend Framework & Language**
- **Next.js** (v16.1.5) - React framework with App Router for server-side rendering and static generation
- **React** (v19.2.3) - UI library for building component-based interfaces
- **TypeScript** (v5) - Type-safe JavaScript with strict mode enabled

#### **Styling & UI Components**
- **Tailwind CSS** (v4) - Utility-first CSS framework with custom configuration
- **Shadcn UI** - Component library built on Radix UI primitives and Tailwind CSS
- **Radix UI** - Headless, accessible UI component primitives:
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-switch` - Toggle switches
  - `@radix-ui/react-slot` - Composition utilities
- **Lucide React** (v0.563.0) - Beautiful, consistent icon library
- **Class Variance Authority** (v0.7.1) - Component variant management
- **Tailwind Merge** (v3.4.0) - Intelligent CSS class merging
- **Tailwind CSS Animate** (v1.0.7) - Animation utilities

#### **Backend & Database**
- **Firebase** (v12.8.0) - Backend-as-a-Service platform:
  - **Firestore** - NoSQL document database for portfolio data
  - **Firebase Realtime Database** - Real-time activity logging and analytics
  - **Firebase Storage** - Image and file hosting with CDN
  - **Firebase Authentication** - User authentication system
- **Firebase Admin SDK** (v13.6.1) - Server-side Firebase operations

#### **Authentication & Security**
- **Google OAuth 2.0** - Google Sign-In integration
- **ZestAcademy SSO** - Custom OAuth integration with ZestAcademy platform
- **JWT-based Token Management** - Secure token handling and validation
- **HTTP-Only Cookies** - Secure token storage (never localStorage)
- **CSRF Protection** - State parameter validation in OAuth flows

#### **Document Processing**
- **Mammoth** (v1.11.0) - DOCX file parsing for resume upload
- **PDF2JSON** (v4.0.2) - PDF parsing for resume extraction
- **Cheerio** (v1.2.0) - HTML parsing and manipulation

#### **AI Integration**
- **Google Generative AI** (v0.24.1) - AI-powered features (Gemini integration)

#### **Utilities**
- **Date-fns** (v4.1.0) - Modern date utility library
- **CLSX** (v2.1.1) - Conditional CSS class construction

#### **Development Tools**
- **ESLint** (v9) - Code linting with Next.js configuration
- **Babel React Compiler** (v1.0.0) - Experimental React compiler for optimization
- **TypeScript** (v5) - Type checking and IntelliSense
- **PostCSS** - CSS processing with Tailwind
- **Tailwind Typography** (v0.5.19) - Beautiful typographic defaults

#### **Build & Deployment**
- **Next.js Build System** - Optimized production builds
- **Vercel** (implied) - Serverless deployment platform
- **Firebase Hosting** - Alternative hosting option
- **Image Optimization** - AVIF and WebP format support

```

## 🧩 Components

### Page Components (App Router)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page with feature highlights and CTAs |
| `/login` | `app/login/page.tsx` | Authentication page (OAuth & SSO) |
| `/signup` | `app/signup/page.tsx` | User registration page |
| `/dashboard` | `app/dashboard/page.tsx` | Main dashboard overview |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | Profile editor (name, bio, contact) |
| `/dashboard/projects` | `app/dashboard/projects/page.tsx` | Project management interface |
| `/dashboard/skills` | `app/dashboard/skills/page.tsx` | Skills management |
| `/dashboard/education` | `app/dashboard/education/page.tsx` | Education timeline editor |
| `/dashboard/templates` | `app/dashboard/templates/page.tsx` | Template selection page |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | Portfolio settings & privacy |
| `/admin` | `app/admin/page.tsx` | Admin dashboard (restricted) |
| `/u/[username]` | `app/u/[username]/page.tsx` | Public portfolio page (dynamic) |
| `/preview` | `app/preview/page.tsx` | Portfolio preview before publishing |
| `/templates` | `app/templates/page.tsx` | Template gallery |
| `/features` | `app/features/page.tsx` | Feature showcase page |
| `/examples` | `app/examples/page.tsx` | Example portfolios |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Privacy policy |
| `/terms-conditions` | `app/terms-conditions/page.tsx` | Terms and conditions |

### Form Components (`src/components/forms/`)

| Component | File | Purpose |
|-----------|------|---------|
| `ProfileForm` | `profile-form.tsx` | Full name, title, bio, domain, contact info, social links |
| `ProjectsForm` | `projects-form.tsx` | Add/edit projects with title, description, tech stack, links, images |
| `SkillsForm` | `skills-form.tsx` | Skill tag management with icon mapping |
| `EducationForm` | `education-form.tsx` | Academic history timeline (degree, institution, dates) |

### Dashboard Components (`src/components/dashboard/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Sidebar` | `sidebar.tsx` | Navigation menu with active state indicators |
| `UserProfile` | `user-profile.tsx` | User profile widget with avatar and quick stats |
| `ResumeParser` | `resume-parser.tsx` | Resume upload, parsing (PDF/DOCX), and auto-fill |

### Template Components (`src/components/templates/`)

| Component | File | Purpose |
|-----------|------|---------|
| `TemplateRenderer` | `template-renderer.tsx` | Dynamic template selector and renderer |
| `MinimalTemplate` | `minimal-template.tsx` | Clean, minimalist portfolio design |
| `ModernTemplate` | `modern-template.tsx` | Contemporary professional portfolio design |

### UI Components (`src/components/ui/`) - Shadcn/Radix

| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `button.tsx` | Styled button with variants (default, destructive, outline, ghost, link) |
| `Input` | `input.tsx` | Text input field with proper styling |
| `Card` | `card.tsx` | Container component with header, content, and footer sections |
| `Dialog` | `dialog.tsx` | Modal dialog with overlay and animations |
| `Label` | `label.tsx` | Accessible form labels |
| `Badge` | `badge.tsx` | Tag/badge component for skills and categories |
| `Alert` | `alert.tsx` | Notification and alert messages |
| `Switch` | `switch.tsx` | Toggle switch for settings |

### Navigation & Layout Components (`src/components/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `navbar.tsx` | Top navigation bar with authentication state |
| `Footer` | `footer.tsx` | Footer with links and copyright |
| `ThemeToggle` | `theme-toggle.tsx` | Dark/light mode switcher |

### Context Providers (`src/lib/`)

| Provider | File | Purpose |
|----------|------|---------|
| `AuthContext` | `auth-context.tsx` | Authentication state management and user data |
| `ThemeContext` | `theme-context.tsx` | Theme state (dark/light mode) management |

## 🔌 API Routes

| Endpoint | File | Method | Purpose |
|----------|------|--------|---------|
| `/api/parse-resume` | `api/parse-resume/route.ts` | POST | Parse uploaded resume (PDF/DOCX) and extract data |
| `/api/portfolio/[username]` | `api/portfolio/[username]/route.ts` | GET | Fetch public portfolio data by username |
| `/api/templates/[templateId]` | `api/templates/[templateId]/route.ts` | GET | Fetch template configuration and assets |

## 🛠️ Utility Functions & Libraries

### Core Utilities (`src/lib/`)

| File | Purpose |
|------|---------|
| `firebase.ts` | Firebase client SDK initialization and configuration |
| `firebase-admin.ts` | Firebase Admin SDK for server-side operations |
| `cookie-utils.ts` | Cookie parsing, setting, and validation utilities |
| `templates.ts` | Template configurations, metadata, and registry |
| `utils.ts` | General helper functions (className merging, formatting, etc.) |

### Constants & Types

| File | Purpose |
|------|---------|
| `src/constants/mock-data.ts` | Mock portfolio data for examples and testing |
| `src/types/index.ts` | TypeScript interfaces and type definitions |

## 📦 Getting Started

### Prerequisites
*   Node.js 18+ installed
*   Firebase Project created

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/zestfolio.git
    cd zestfolio
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
    Create a `.env.local` file with your configuration:
    ```env
    # Firebase (for Firestore/Storage only)
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    
    # Google OAuth (optional - for Google authentication)
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
    
    # ZestAcademy SSO
    NEXT_PUBLIC_SSO_AUTH_URL=https://auth.zestacademy.tech
    NEXT_PUBLIC_SSO_CLIENT_ID=zestfolio
    NEXT_PUBLIC_SSO_REDIRECT_URI=https://zestfolio.tech/api/auth/callback
    SSO_CLIENT_SECRET=your_client_secret_here
    ```
    See `.env.example` for complete configuration.

4.  Run the Development Server:
    ```bash
    npm run dev
    ```
    *   **Local**: [http://localhost:3000](http://localhost:3000)
    *   **Network**: Accessible via your local IP (e.g., http://192.168.1.x:3000)

### Available Scripts

```bash
npm run dev      # Start development server on 0.0.0.0:3000 (accessible on network)
npm run build    # Create optimized production build
npm run start    # Start production server
npm run lint     # Run ESLint for code quality checks
```

## 🎨 Key Features Explained

### Authentication Flow
1. User clicks "Sign In" on landing page
2. Chooses between Google OAuth or ZestAcademy SSO
3. OAuth flow redirects to provider → user authorizes → callback with auth code
4. Backend exchanges auth code for tokens (client secret never exposed)
5. Tokens stored in HTTP-Only cookies (secure, not accessible via JavaScript)
6. User redirected to dashboard with authenticated session

### Portfolio Creation Workflow
1. **Profile Setup**: Add personal info, bio, contact details, social links
2. **Resume Import** (Optional): Upload PDF/DOCX resume for auto-fill
3. **Project Management**: Add projects with images, descriptions, tech stack
4. **Skills Management**: Tag skills with automatic icon mapping
5. **Education Timeline**: Add academic history chronologically
6. **Template Selection**: Choose from pre-designed templates
7. **Preview & Publish**: Preview portfolio, then make it live
8. **Custom URL**: Portfolio accessible at `zestfolio.tech/u/[username]`

### Admin Dashboard Features
- **User Overview**: Total users, active portfolios, average projects per user
- **User Management**: Search and filter by name, username, email
- **Status Monitoring**: View portfolio status (Live/Paused/Draft)
- **Analytics**: Track user activity and registration logs

## 📅 System Updates (Change Log)

### **Latest Update (February 5, 2026)**
*   **Zest ID Architecture Implementation**:
    *   **Unique Zest IDs**: Every user now receives a unique Zest ID (format: `ZU0001`, `ZU0002`, etc.) upon registration
    *   **Portfolio Document Keys**: All portfolios are now stored in Firestore using Zest IDs as document keys instead of Firebase UIDs
    *   **Backward Compatibility**: Automatic fallback loading from old UID-based documents ensures seamless migration for existing users
    *   **Data Migration**: When existing users save their portfolio, data automatically migrates to the new Zest ID document structure
    *   **Admin Dashboard**: Updated to match users with portfolios using Zest IDs (with UID fallback for legacy data)
*   **Activity Logging System**:
    *   **Realtime Database Integration**: New user registrations are now logged to Firebase Realtime Database
    *   **Registration Tracking**: Captures user registration events (Google OAuth and Email-based) with detailed metadata
    *   **Log Format**: Includes `displayName`, `zestId`, `uid`, `timestamp`, and `action` for comprehensive tracking
    *   **Activity Path**: Logs stored in `registration_logs` for easy monitoring and analytics
*   **Enhanced Data Organization**:
    *   **Consistent Identifiers**: Both `uid` and `zestId` are stored within portfolio documents for reference
    *   **Improved Scalability**: Zest ID-based structure supports future cross-platform integration
    *   **Type Safety**: Fixed TypeScript errors with proper variable capturing in async operations

### **Previous Update (February 2, 2026)**
*   **Google OAuth Integration**:
    *   **Multiple Authentication Options**: Users can now sign in with Google or ZestAcademy SSO
    *   **OAuth 2.0 Flow**: Secure authorization code flow with CSRF protection
    *   **HTTP-Only Cookies**: Tokens stored securely, never in localStorage
    *   **Backend Token Exchange**: Client secret never exposed to frontend
    *   **Flexible Authentication**: Choose your preferred sign-in method
*   **Single Sign-On (SSO) Integration**:
    *   **Unified Authentication**: Login with ZestAcademy account across all platforms
    *   **OAuth 2.0 Flow**: Secure authorization code flow with CSRF protection
    *   **HTTP-Only Cookies**: Tokens stored securely, never in localStorage
    *   **Backend Token Exchange**: Client secret never exposed to frontend
    *   **Global Logout**: Sign out from all ZestAcademy platforms at once
    *   **JWT Validation**: Automatic token expiration and issuer checks
    *   **Seamless Experience**: One account for zestacademy.tech, zestfolio.tech, and zestcompilers.tech
*   **Security Enhancements**:
    *   No passwords stored or transmitted by Zestfolio
    *   State parameter validation for CSRF protection
    *   Secure cookie configuration with SameSite protection
    *   Token validation on every request

### **Previous Update (January 28, 2026)**
*   **Admin Dashboard Cleanup & Reconfiguration**:
    *   **Improved User Identification**: Table now displays "Full Name" and "URL Name" directly from the database root.
    *   **Enhanced Search**: Search functionality now filters by Full Name, URL Name, and Email.
    *   **Simplified Stats**: Removed "Inactive Users" card; now showing Total Users, Active Portfolios, and Avg Projects/User.
    *   **Admin Security**: Implemented strict email-based admin authentication (`zestacademy@...`).
    *   **Loading States**: Added visual loading indicators for better UX.
*   **Data Structure Optimization**:
    *   Flattened user profile data structure (FullName/Email now at document root) for more efficient querying and display.
*   **Profile Management**:
    *   Users can update their "Full Name" and "URL Name" which are reflected instantly across the app.

### **Previous Updates**
*   **User Settings**: "Pause Portfolio" functionality added.
*   **Security**: Updated `firestore.rules` and implemented automatic maintenance page.
*   **Network Access**: Dev server spans `0.0.0.0` for local testing.

## 🔒 Security

### Authentication
*   **Multiple Authentication Options**: Google OAuth 2.0 and ZestAcademy SSO
*   **OAuth 2.0 Standard**: Industry-standard authentication protocol
*   **No Password Storage**: Zestfolio never handles passwords
*   **HTTP-Only Cookies**: Secure token storage
*   **CSRF Protection**: State parameter validation
*   **JWT Validation**: Automatic token verification

### Firestore Rules
*   **Public Read**: Allowed for `portfolios` collection (required for public pages).
*   **Private Write**: Only the document owner can edit their portfolio.
*   **Admin Access**: Special admin accounts (`zestacademy@rsmk.co.in`, `zestacademyonline@gmail.com`) have full dashboard access.

For detailed SSO documentation, see [SSO_INTEGRATION_GUIDE.md](./SSO_INTEGRATION_GUIDE.md).

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
