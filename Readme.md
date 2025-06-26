# QuickBlog

QuickBlog is a full-stack blogging platform built with a React frontend and a Node.js/Express/MongoDB backend. It supports user authentication, blog creation, commenting, admin controls, and image uploads with ImageKit. The project is ready for deployment on Vercel.

## Features

- User registration and login (JWT-based authentication)
- Role-based access (user, admin, super-admin)
- Create, edit, and delete blogs (admin/super-admin)
- Add and moderate comments
- Image upload and optimization via ImageKit
- Responsive UI with React and Quill rich text editor
- Secure API endpoints with middleware
- MongoDB for data storage

## Project Structure

```
quickblog/
  client/         # React frontend
  server/         # Node.js/Express backend
  .env            # Environment variables (not committed)
  .gitignore      # Git ignore file
  vercel.json     # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- ImageKit account

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd quickblog
   ```
2. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Create a `.env` file in the `server/` directory with your secrets:
   ```env
   MONGODB_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```
4. Start the backend:
   ```bash
   cd server
   npm run dev
   ```
5. Start the frontend:
   ```bash
   cd ../client
   npm run dev
   ```

## Deployment

- The project is configured for Vercel deployment using `vercel.json`.
- Make sure to set your environment variables in the Vercel dashboard.

## Security Notes

- Do not trust localStorage for sensitive data or authorization. Always validate roles and permissions on the backend.
- Use HTTPS in production.

## License

MIT
