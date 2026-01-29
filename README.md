# Student Hub

**Student Hub** is a comprehensive campus marketplace and service platform designed to connect students, vendors, and runners. It facilitates buying and selling products, managing deliveries, and participating in campus activities through a unified digital ecosystem.

> **Note:** This is a private repository. Access is restricted to authorized personnel only.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest)
- **Media:** [Cloudinary](https://cloudinary.com/)
- **Maps:** Leaflet / Mapbox

## ✨ Key Features

- **🛍️ Marketplace:** Browse and purchase products across various categories.
- **⚡ Flash Sales:** Time-limited deals and special offers.
- **🚚 Runner System:** Integrated delivery network allowing students to earn by delivering orders.
- **🏪 Vendor Dashboard:** Complete tools for vendors to manage inventory, orders, and earnings.
- **🛡️ Admin Control:** Comprehensive admin panel for user management, content moderation, and system configuration.
- **💬 Messaging:** Built-in communication tools for users and support.

## 🛠️ Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm, yarn, pnpm, or bun
- PostgreSQL database instance

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd student-hub
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Copy the example environment file and update the variables:
    ```bash
    cp .env.example .env
    ```
    *Refer to `docs/ENV_TEMPLATE.md` for detailed environment variable descriptions.*

4.  **Database Setup**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

- `src/app`: Application routes and pages (Next.js App Router).
- `src/components`: Reusable UI components.
- `prisma`: Database schema and migrations.
- `public`: Static assets.
- `docs`: Project documentation and guides.

## 📜 License

This project is proprietary software. All rights reserved. See the [LICENSE](LICENSE) file for details.
