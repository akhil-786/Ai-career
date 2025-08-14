# Manual Deployment Guide

This guide will walk you through deploying your CareerWise AI application manually using the Firebase CLI. Since this project is configured for Firebase App Hosting, it's the recommended deployment target.

## Prerequisites

Before you begin, ensure you have the following installed and configured:

1.  **Node.js**: Make sure you have Node.js (version 18 or later) installed.
2.  **Firebase CLI**: If you don't have it, install the Firebase Command Line Interface globally on your machine.
    ```bash
    npm install -g firebase-tools
    ```
3.  **Logged into Firebase**: You must be authenticated with your Google account in the Firebase CLI.
    ```bash
    firebase login
    ```

## Deployment Steps

Follow these steps to deploy your application:

### Step 1: Link Your Project

If this is your first time deploying from your local machine, you need to associate your local project directory with your Firebase project.

Navigate to your project's root directory in your terminal and run:

```bash
firebase use --add
```

Select your Firebase project (e.g., `careerwise-ai-sd7y4`) from the list. This step only needs to be done once.

### Step 2: Set Production Environment Variables

Your application relies on environment variables for Firebase configuration and the Gemini API key. For security, these should not be stored in your code. You need to set them as secrets in Firebase App Hosting.

Run the following commands in your terminal, replacing `your_api_key_here` with your actual secret values.

```bash
# Set Firebase Public Variables
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_PROJECT_ID
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_APP_ID

# Set Gemini Secret Key
firebase apphosting:secrets:set GEMINI_API_KEY
```
When prompted, enter the corresponding value for each secret. These secrets are stored securely and will be made available to your application at runtime.

### Step 3: Build the Application

Before deploying, you need to create a production-ready build of your Next.js application.

```bash
npm run build
```

This command compiles your code and optimizes it for performance.

### Step 4: Deploy to Firebase

Now you are ready to deploy. Run the following command:

```bash
firebase deploy --only apphosting
```

The Firebase CLI will package your application code, your Genkit flows, and the configuration from `apphosting.yaml`, and deploy everything to Firebase App Hosting.

After the deployment is complete, the CLI will output the URL of your live application. You can visit this URL to see your deployed app.
