## WhatsApp History Displayer

> [!NOTE]  
> This is a work in progress.

This is a feature that allows you to render particular WhatsApp exported history in a UI, with messages stored safely in a PostgreSQL database. It includes the ability to mutate a "favorites" boolean, search through individual chats or all chats at once, and more.

## Tech Stack

-   TypeScript, TailwindCSS, and Python

    ### Python is used to convert your WhatsApp chat exports to `.json`, which is then used to seed the database. See [link to readme part seeding]

-   Next.js 15 RC
-   React 19 RC
-   DrizzleORM
-   PostgreSQL
-   Zustand

## Features

-   Render WhatsApp exported chat history in a clean UI
-   Store messages securely in PostgreSQL
-   Mark messages as favorites with a toggle feature
-   Search across individual or all chats
-   Real-time updates on message states

## Database Schema

### Tables

-   **messages**

    -   Stores individual WhatsApp messages with fields like:
        -   `id`: Unique identifier for each message.
        -   `chatId`: Identifier for the chat, indexed for fast lookups.
        -   `name`: Name of the sender.
        -   `message`: Content of the message.
        -   `timestamp`: Time the message was sent, with a default value of the current time.
        -   `attachment`: Optional field for media attachments.

-   **favorites**
    -   Tracks messages that have been marked as favorites by users:
        -   `id`: Unique identifier for each favorite entry.
        -   `messageId`: Foreign key referencing the `messages` table. Indexed with `userId` for efficient querying.
        -   `userId`: Identifier for the user who marked the message as a favorite.
        -   `createdAt`: Timestamp for when the favorite was created.

### Indexing

-   An index is created on the `chatId` field in the `messages` table to allow faster queries when filtering by chat.
-   A composite index is created on the `messageId` and `userId` fields in the `favorites` table to allow efficient lookups for a user's favorited messages.

## Environment Variables

Add the following environment variables to your `.env.local` file:

-   `DATABASE_URL`: Connection string for PostgreSQL.
-   `NEXT_PUBLIC_API_URL`: The API URL for accessing chat data.

## Python Script for WhatsApp Export

Python is used to parse the exported WhatsApp text file into JSON format. The JSON is then used to seed the PostgreSQL database.

Steps:

1. Place your WhatsApp `.txt` file in the `/exports` folder.
2. Run the Python script to convert the file to JSON:

    ```bash
    python convert.py exports/whatsapp.txt --output chat.json
    ```

3. Use the generated JSON to populate your database.

## API Endpoints

-   `GET /api/chats`: Fetch all chats.
-   `GET /api/chats/{chatId}`: Fetch individual chat details.
-   `POST /api/messages/{messageId}/favorite`: Mark a message as favorite.

## Setup

```bash
git clone xxx && cd xx && cp .env.local.example .env.local && pnpm i
```

## UI/UX

-   State management: Zustand is used for managing UI state, especially for toggling favorites and filtering messages.
-   TailwindCSS is used for styling, ensuring a responsive and consistent UI.

## Future Improvements

-   Add message encryption for enhanced privacy.
-   Implement pagination for large chat histories.
-   Support for media attachments in chats.
