# Chat Application Frontend

This is the frontend of the chat application built with Next.js and TypeScript. It allows users to sign up, log in, join chat rooms, and send messages in real-time.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (sign up, log in, log out)
- Real-time messaging with WebSockets
- Responsive design
- Notification for new messages
- User typing indicator

## Installation

To get started with the frontend, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/Mansvini/chat-app-frontend.git
    cd chat-app-frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Usage

To run the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

## Environment Variables

The following environment variables need to be set in a `.env.local` file at the root of the project:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_LOCAL_BACKEND_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret
```

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
