# Military Personnel Recommendation Management System

A modern web application for managing military personnel recommendations, built with **Angular 17** (standalone components) and **Supabase** as the backend database. This system replaces Excel filtering for searching soldiers and storing recommendations.

## 🚀 Quick Start

See [QUICKSTART.md](QUICKSTART.md) for setup in 5 minutes, or [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed guide.

### Prerequisites
- Node.js v18+
- Angular CLI v17+
- Supabase account (free tier available)

### Install & Run

```bash
# Install dependencies
npm install

# Configure Supabase credentials in src/environments/environment.ts

# Start development server
ng serve
```

Navigate to `http://localhost:4200/`

## 📋 Features

- 🔍 **Advanced Search** - Partial name matching with Arabic text normalization
- 👮 **Police Number Lookup** - Fast search by ID
- 📝 **Recommendation Management** - Add and track soldier recommendations
- 🎨 **Modern UI** - Bootstrap-powered responsive design
- 🗄️ **Supabase Backend** - Reliable PostgreSQL database
- ⚡ **Real-time Updates** - Instant search results and feedback

## 📁 Project Structure

```
src/app/
├── components/        # Reusable UI components
│   ├── navbar/
│   ├── soldier-card/
│   └── recommendation-list/
├── models/           # TypeScript interfaces
├── pages/            # Page components
│   ├── home/
│   ├── search/
│   └── recommendations/
├── services/         # Business logic and data access
│   └── supabase.service.ts
└── environments/     # Environment configuration
```

## 🛠️ Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
