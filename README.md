# ZestFolio - Student Portfolio Platform

ZestFolio is a dynamic portfolio building platform designed for students to showcase their projects, skills, and education. It leverages Next.js, Firebase, and Tailwind CSS to provide a premium, responsive, and secure experience.

## 🚀 Features

### **For Students (Users)**
*   **Dynamic Portfolio Generation**: Create a stunning portfolio in minutes.
*   **Theme Selection**: Choose from multiple professionally designed templates.
*   **Project Showcase**: Add projects with images, descriptions, and links.
*   **Skill Management**: Visual skill tags with automatic icon mapping.
*   **Education Timeline**: sorted chronologically.
*   **Status Control**: Manually "Pause" your portfolio to hide it from the public (Maintenance Mode).
*   **Auto-Inactivity**: Accounts inactive for >90 days are automatically marked as "Dormant".

### **For Administrators**
*   **Admin Dashboard**: comprehensive overview of all users.
*   **User Monitoring**: Track total users, active portfolios, and inactive users.
*   **Activity Logs**: View "Last Active" dates to identify dormant accounts.
*   **Search**: Filter users by name, email, or username.

## 🛠 Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + Shadcn UI
*   **Database**: Firebase Firestore
*   **Authentication**: Firebase Auth
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
    Create a `.env.local` file with your Firebase config:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    # ... other firebase vars
    ```

4.  Run the Development Server:
    ```bash
    npm run dev
    ```
    *   **Local**: [http://localhost:3000](http://localhost:3000)
    *   **Network**: Accessible via your local IP (e.g., http://192.168.1.x:3000)

## 📅 System Updates (Change Log)

### **Latest Update (January 28, 2026)**
*   **Admin Dashboard Enhancements**:
    *   Added "Inactive Users" tracking (users inactive > 90 days).
    *   Added "Last Active" column to admin table.
    *   Implemented visual status indicators: **Live** (Green), **Paused** (Amber), **Dormant** (Red).
*   **User Settings**:
    *   New "Settings" page added.
    *   Implemented "Pause Portfolio" functionality.
*   **Security & Logic**:
    *   Updated `firestore.rules` to secure write access while allowing public reads.
    *   Implemented automatic maintenance page for inactive/paused portfolios.
    *   Added automatic "Last Active" timestamp tracking on dashboard login.
*   **Network Access**: Updated `package.json` to bind dev server to `0.0.0.0` for local network testing.

## 🔒 Security Rules (Firestore)

*   **Public Read**: Allowed for `portfolios` collection (required for public pages).
*   **Private Write**: Only the document owner can edit their portfolio.
*   **Admin Access**: Special admin accounts (`zestacademy@...`) have full read access.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
