# Advanced Banking System

A modern, feature-rich banking system built with React, TypeScript, and Vite. This application provides comprehensive banking operations including account management, transactions, customer service, reporting, and user administration.

## 🚀 Features

### Core Modules

- **Authentication & Authorization**
  - Secure login system
  - Role-based access control (RBAC)
  - Protected routes and guards
  - Session management

- **Account Management**
  - Create and manage accounts
  - Account grouping functionality
  - Sub-account creation
  - Account details and pagination
  - Account state management

- **Transaction Management**
  - Transaction processing
  - Transaction approvals workflow
  - Transaction commands and queries
  - Scheduled transactions

- **Customer Service**
  - Ticket management system
  - Ticket status tracking
  - Customer service filters and pagination
  - Ticket details and forms

- **Dashboard**
  - Comprehensive dashboard with multiple views
  - Navigation and sidebar
  - Dashboard layout components

- **Statistics & Reporting**
  - Data visualization
  - Statistical analysis
  - Report generation

- **User Management**
  - User administration
  - User roles and permissions

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TanStack Router** - Type-safe routing

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Server state management and data fetching
- **Axios** - HTTP client

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Chart library for data visualization
- **Sonner** - Toast notifications

### Forms & Validation
- **React Hook Form** - Form state management
- **Yup** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Internationalization
- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next
- Supports English and Arabic languages

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd advanced-banking-system
```

2. Install dependencies:
```bash
npm install
```

## 🚦 Getting Started

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

### Building for Production

Build the application for production:
```bash
npm run build
```

The optimized build will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── features/              # Feature modules
│   ├── account-management/
│   ├── auth/
│   ├── customer-service/
│   ├── dashboard/
│   ├── report/
│   ├── scheduled-trans/
│   ├── statistics/
│   ├── transactions/
│   └── users/
├── shared/               # Shared components and utilities
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   └── pages/
├── lib/                  # Library configurations
│   ├── axios/
│   ├── query-facade/
│   └── storage/
├── stores/               # Zustand stores
├── routes/                # Route configurations
├── theme/                 # Theme configuration
├── locales/               # Translation files
├── i18n/                  # i18n configuration
└── main.tsx              # Application entry point
```

## 🌐 Internationalization

The application supports multiple languages:
- English (en) - Default
- Arabic (ar)

Language files are located in `src/locales/`. The language can be toggled using the language toggle component.

## 🎨 Theming

The application supports theme switching (light/dark mode) using the theme toggle component. Theme configuration is managed in `src/theme/`.

## 🔐 Authentication

The application includes:
- Secure authentication flow
- Protected routes
- Role-based access control
- Session persistence

## 📝 Code Style

The project uses:
- **ESLint** for code linting
- **TypeScript** for type checking
- Consistent code formatting

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass and linting is clean
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👥 Support

For support and questions, please contact the development team.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
