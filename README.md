# CareerWise AI

This is a Next.js application built with Firebase Studio, designed to be your AI Career Mentor.

## Running Locally

To run this application on your local machine, follow these steps.

### 1. Install Dependencies

First, you need to install all the necessary packages defined in `package.json`. Open your terminal in the project's root directory and run:

```bash
npm install
```

### 2. Set Up Environment Variables

The application uses Firebase for authentication and database services, and Genkit for its AI capabilities. You need to provide your specific Firebase project configuration and a Gemini API key.

Create a new file named `.env.local` in the root of your project. Copy the contents below into this new file and replace the placeholder values with your actual credentials.

```env
# Firebase Configuration - get these from your Firebase project settings
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google AI (Gemini) API Key - get this from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key
```

**To get your Firebase config:**
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click the gear icon next to "Project Overview" and go to **Project settings**.
4. In the "General" tab, under "Your apps", find your web app.
5. Select the **Config** option to view your Firebase configuration object.

**To get your Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a new API key.

### 3. Run the Application

This project requires two separate processes to run at the same time: the Next.js front-end and the Genkit AI backend. You'll need to open two separate terminal windows.

**In your first terminal**, run the Next.js development server:
```bash
npm run dev
```
This will start the web application, usually on `http://localhost:9002`.

**In your second terminal**, run the Genkit development server:
```bash
npm run genkit:watch
```
This will start the AI flow server, which your Next.js application communicates with for features like the Resume Analyzer and Mock Interviewer.

Once both processes are running, you can open your browser to `http://localhost:9002` to see your application in action.
