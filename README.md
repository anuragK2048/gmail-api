# Gmail API Backend Service

This project is a robust backend service built with Node.js, Express, and TypeScript to interact with the Gmail API. It provides a custom email client experience with features like AI-powered email classification, real-time synchronization via Google Pub/Sub, and a custom labeling system. It uses Supabase for the database, Redis for session management, and BullMQ for handling background jobs.

## Key Features

- **Secure Authentication**: OAuth 2.0 flow for secure Google sign-in and account linking.
- **Multi-Account Support**: Link multiple Gmail accounts to a single application user.
- **Real-Time Sync**: Utilizes Google Pub/Sub and BullMQ background workers to sync email changes in real-time.
- **AI-Powered Labeling**: Automatically classifies incoming emails and applies user-defined labels using Google Gemini/OpenAI.
- **Custom Label Management**: Full CRUD functionality for creating, updating, and deleting custom labels.
- **Comprehensive Email API**: A rich set of API endpoints to fetch, view, and manage emails (e.g., by inbox, system labels like 'STARRED' or 'UNREAD', and custom labels).
- **Email Actions**: Mark emails as read/unread, star/unstar, and apply/remove labels.
- **Secure & Scalable**: Built with security best practices, including encrypted token storage, and uses a job queue for scalable background processing.

## Tech Stack

- **Backend**: Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Session & Caching**: Redis
- **Background Jobs**: BullMQ
- **Authentication**: Google OAuth 2.0
- **API Integration**: Google API (Gmail, People API, Pub/Sub)
- **AI / LLM**: Google Gemini / OpenAI
- **Validation**: Zod

## API Endpoints

Here are some of the primary API endpoints available:

| Method   | Endpoint                               | Description                                               |
| :------- | :------------------------------------- | :-------------------------------------------------------- |
| `GET`    | `/api/v1/auth/google`                  | Initiates the Google OAuth login flow.                    |
| `POST`   | `/api/v1/auth/logout`                  | Logs out the current user and clears the session.         |
| `GET`    | `/api/v1/users/me`                     | Retrieves the current user's profile and linked accounts. |
| `DELETE` | `/api/v1/users/me`                     | Deletes the current user's account and revokes tokens.    |
| `GET`    | `/api/v1/emails/inbox/all`             | Fetches a paginated list of all inbox emails.             |
| `GET`    | `/api/v1/emails/system/:systemLabelId` | Fetches emails by a system label (e.g., `STARRED`).       |
| `GET`    | `/api/v1/emails/:emailId`              | Retrieves the full details of a single email.             |
| `POST`   | `/api/v1/emails/:emailId/read`         | Marks a specific email as read.                           |
| `POST`   | `/api/v1/emails/:emailId/star`         | Stars a specific email.                                   |
| `GET`    | `/api/v1/labels`                       | Lists all custom labels for the user.                     |
| `POST`   | `/api/v1/labels`                       | Creates a new custom label.                               |
| `POST`   | `/api/v1/sync/gmail-webhook`           | Endpoint for Google Pub/Sub to push notifications.        |

## Setup and Installation

To get the project running locally, follow these steps:

**1. Clone the repository:**

```bash
git clone https://github.com/anuragK2048/gmail-api.git
cd gmail-api
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up Environment Variables:**
Create a `.env` file in the root of the project and add the necessary environment variables. See the `.env.example` section below.

**4. Set up Supabase:**

- Create a new project on [Supabase](https://supabase.com/).
- Get your project URL and anon key and add them to the `.env` file.

**5. Set up Google Cloud Project:**

- Create a project on the [Google Cloud Console](https://console.cloud.google.com/).
- Enable the **Gmail API**, **Google People API**, and **Google Pub/Sub API**.
- Create OAuth 2.0 credentials (Client ID and Secret) and add them to your `.env` file.
- Create a Pub/Sub topic and add the topic name to your `.env` file.

**6. Set up Redis:**

- Install and run a local Redis instance or use a cloud-based Redis service.
- Add the Redis connection URL to your `.env` file.

**7. Build the project:**

```bash
npm run build
```

**8. Run the server and worker:**

- Start the main application server:
  ```bash
  npm run dev
  ```
- In a separate terminal, start the background worker for processing jobs:
  ```bash
  npm run worker
  ```

## Environment Variables

Create a `.env` file with the following variables.

```env
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_super_secret_session_string_at_least_32_chars_long
ENCRYPTION_KEY=your_strong_32_character_encryption_key_for_tokens

# Redis
REDIS_URL=redis://localhost:6379

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URI=http://localhost:5000/api/v1/auth/google/callback

# Google Pub/Sub
GOOGLE_PUB_SUB_TOPIC_NAME=projects/your-gcp-project-id/topics/your-topic-name

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```
