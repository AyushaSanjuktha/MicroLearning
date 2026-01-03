<<<<<<< HEAD

# MicroLearnAI

### A Personalized Micro-Learning Platform Powered by Generative AI

MicroLearnAI is a modern web application built with Next.js that leverages the power of Google's Gemini models through Genkit to deliver dynamic, on-demand educational content. It provides users with bite-sized lessons and interactive quizzes on various topics, with all progress, scores, and achievements tracked in a robust Firebase backend.

This project serves as a powerful demonstration of integrating a cutting-edge AI stack with a scalable, serverless backend to create a personalized and engaging user experience.

---

## Key Features

- **Dynamic Content Generation**: Uses Genkit to call Google's Gemini Pro model, generating unique micro-lessons and quizzes in real-time based on user-selected topics.
- **Personalized Learning**: Users can choose topics of interest and receive tailored content.
- **Interactive Quizzes**: Each lesson is followed by a multiple-choice quiz to reinforce learning.
- **AI-Powered Feedback**: Provides intelligent feedback on quiz performance, identifying potential areas of misunderstanding.
- **User Authentication**: Secure user sign-up, login, and anonymous access powered by Firebase Authentication.
- **Progress Tracking**: All user data, including quiz scores, time spent, and completed topics, is stored securely in Firestore.
- **Dynamic Dashboard**: A comprehensive dashboard that visualizes user progress, quiz performance, and earned achievements, all fetched directly from Firestore.
- **Modern, Responsive UI**: Built with ShadCN UI and Tailwind CSS for a clean, accessible, and responsive user interface on all devices.

---

## Technology Stack

This project is built on a modern, type-safe, and scalable technology stack.

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) for orchestrating calls to Google's Generative AI models.
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
- **UI Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- An active Firebase project.
- A Google AI API key for Genkit.

### 1. Configure Firebase

1.  Navigate to your Firebase project console.
2.  Go to **Project Settings** > **General**.
3.  Under "Your apps", create a new "Web" app.
4.  Copy the `firebaseConfig` object and paste it into `src/firebase/config.ts`.
5.  In the console, go to the **Firestore Database** section and create a new database.
6.  Go to the **Authentication** section and enable the "Email/Password" and "Anonymous" sign-in providers.

### 2. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add your Google AI API key:

```
GEMINI_API_KEY=your_google_ai_api_key_here
```

### 3. Install Dependencies & Run

Install the necessary packages and run the development server:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:9002`.

### 4. Run the Genkit Developer UI

To inspect and test your AI flows, run the Genkit development service in a separate terminal:

```bash
npm run genkit:dev
```

This will start the Genkit development UI, typically at `http://localhost:4000`.

### 5. Seed Initial Data (Important)

The application fetches learning topics from Firestore. The `learningTopics` collection must contain at least one document to populate the UI.

1.  Go to your project's **Firestore Database**.
2.  Create a new collection with the ID `learningTopics`.
3.  Add a new document with the following fields:
    - `id` (string): `arrays`
    - `title` (string): `Arrays`
    - `description` (string): `Learn about arrays.`

Your application is now ready to use.

---

## Backend Architecture

The backend is built entirely on Firebase, leveraging its powerful, serverless features.

- **Authentication**: Firebase Authentication handles user identity. The system is secured using Firestore Security Rules that enforce a strict user-ownership model, ensuring a user can only access their own data.
- **Database**: Firestore is used as the NoSQL database. The data is structured for security and scalability, with all user-specific information nested under a `/users/{userId}` path. Public content like `learningTopics` and `achievementBadges` are stored in root-level collections. See `firestore.rules` for a detailed breakdown of the security model.

This architecture ensures a clear separation between private user data and public content, simplifying security and enabling efficient data queries for features like the user dashboard.
=======
# Firebase Studio - Micro-Learning App

This is a Next.js application built in Firebase Studio that generates AI-powered micro-lessons with interactive quizzes.

## Features

- **AI-Powered Micro-Lessons**: Generate concise 3-minute lessons on any topic using Google's Gemini AI
- **Structured Formatting**: Lessons follow a consistent format with:
  - "Why this matters" hook
  - Clear analogies
  - Proper markdown formatting
  - "Check your understanding" summary
- **Interactive Quizzes**: Each lesson includes multiple-choice quiz questions
- **Quiz Feedback**: Get AI-generated feedback on quiz answers
- **Modern UI**: Built with Next.js, React, and Tailwind CSS

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Google AI API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the root directory:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:9002](http://localhost:9002)

## Available Scripts

- `npm run dev` - Start the development server (runs on port 9002)
- `npm run genkit:dev` - Start the Genkit AI development server
- `npm run genkit:watch` - Start Genkit with watch mode
- `npm run build` - Build the app for production
- `npm run start` - Start the production server
- `npm run lint` - Run the linter
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
studio-main/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── ai/               # Genkit AI flows and configuration
│   │   ├── flows/        # AI flow definitions
│   │   └── genkit.ts     # Genkit configuration
│   ├── components/       # React components
│   │   └── markdown-renderer.tsx  # Markdown rendering component
│   └── lib/              # Utility functions
├── package.json
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **Genkit** - AI orchestration framework
- **Google Gemini AI** - Language model
- **Tailwind CSS** - Styling
- **React Markdown** - Markdown rendering
- **TypeScript** - Type safety

## Key Features

### Micro-Lesson Generation

The app uses a structured prompt to generate micro-lessons that:
- Use proper Markdown formatting (# for titles, ### for headers, ** for key terms)
- Include proper spacing (two newlines between sections)
- Start with a "Why this matters" hook
- Include one clear analogy
- End with a "Check your understanding" summary
- Use blockquotes for important definitions

### Markdown Rendering

The app uses `react-markdown` with `remark-gfm` for GitHub Flavored Markdown support, styled with Tailwind Typography's prose classes for beautiful, readable content.

## Getting Started

To get started, take a look at `src/app/page.tsx` to see the main application component.

## License

This project is part of Firebase Studio.
>>>>>>> b3c1f0b7199f4333f1349cd73c374deec78b7366
