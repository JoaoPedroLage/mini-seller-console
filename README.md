# Mini Seller Console

A lightweight and reactive application for triaging Leads and converting them into Opportunities, developed as a technical challenge for CoverPin Company.

## 🚀 Live Demo

**[Click here to view the live application](https://mini-seller-console-joaopedrolages-projects.vercel.app/)**

## 🎬 Preview

![GIF of the application in action](URL_FOR_YOUR_GIF_HERE)

*(Tip: Record a short GIF showcasing the main features like search, filter, edit, and convert. You can host it directly on GitHub or on Imgur and paste the link here.)*

## 📋 Features

### Core Features (MVP)
-   ✅ **Lead Listing:** Loads data from a local mock API.
-   🔍 **Dynamic Search:** Search for leads by name or company in real-time.
-   📊 **Filter & Sort:** Filter leads by status and sort them by score.
-   📝 **Detail Panel:** Click on a lead to open a slide-over panel with their information.
-   ✏️ **Inline Editing:** Edit a lead's status and email directly in the detail panel, with email format validation.
-   ✨ **Convert to Opportunity:** Convert a qualified lead into a new opportunity with a single click.
-   📈 **Opportunities Table:** View all created opportunities in a separate table.
-   🎨 **UI States:** The interface clearly handles loading, empty, and error states.

### ✨ Bonus Features (Nice-to-Haves)
-   📱 **Responsive Layout:** The application is fully functional and visually appealing on both desktop and mobile devices.
-   💾 **State Persistence:** Search and filter settings are saved to `localStorage`, preserving the user's preferences between sessions.

## 🛠️ Tech Stack

This project was built using the following modern front-end technologies and best practices:

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **UI Library:** [React](https://reactjs.org/) (with Hooks and Server Components)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Accessible UI Components:** [Headless UI](https://headlessui.dev/)
-   **Linting:** [ESLint](https://eslint.org/)
-   **Deployment:** [Vercel](https://vercel.com/)

## ⚙️ Getting Started / Running Locally

Follow the steps below to set up and run the project in your development environment.

### Prerequisites
-   [Node.js](https://nodejs.org/en/) (v18.x or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd mini-seller-console
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application in your browser:**
    Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## 🧠 Architectural Decisions

-   **Next.js with App Router:** Chosen as the most modern and recommended approach for React projects, leveraging Server Components for initial data fetching to improve performance.
-   **Mock API Route (`/api/leads`):** Instead of importing the `JSON` file directly into a component, an API route was created to simulate a real-world scenario. This decouples the data source from the UI and makes it easier to replace with a real backend in the future.
-   **TypeScript:** Used to ensure type-safety, improve code readability, and enhance the developer experience by preventing common bugs.
-   **Componentization:** The application was broken down into small, reusable components, following a feature-based structure (e.g., `/components/leads`) to facilitate maintenance and scalability.
