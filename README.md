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
