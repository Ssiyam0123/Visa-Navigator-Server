# Visa Navigator Server API

**Live API Endpoint:** [https://visa-navigator-server-two-black.vercel.app](https://visa-navigator-server-two-black.vercel.app)

This is the backend API server for the Visa Navigator application. Built with Node.js, Express, and MongoDB, it handles data persistence for visa applications, user details, and CRUD requests from the frontend client.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas

## Getting Started Locally

### Prerequisites
- Node.js installed.
- MongoDB connection URI.

### Setup Instructions
1. Clone this repository.
2. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5002
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
