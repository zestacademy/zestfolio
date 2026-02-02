# ZestFolio - Student Portfolio Platform

ZestFolio is a dynamic portfolio building platform designed for students to showcase their projects, skills, and education. It leverages Next.js, Firebase, and Tailwind CSS to provide a premium, responsive, and secure experience.

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

## 🛠 Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + Shadcn UI
*   **Database**: Firebase Firestore
*   **Authentication**: ZestAcademy SSO (OAuth 2.0)
*   **Storage**: Firebase Storage (for images)
*   **Icons**: Lucide React

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

## 📅 System Updates (Change Log)

### **Latest Update (February 2, 2026)**
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
*   **Single Sign-On**: Powered by ZestAcademy OAuth 2.0
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
