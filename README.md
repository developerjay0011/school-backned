
## Prerequisites

- Node.js
- MySQL

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=meteorin_test_db
   JWT_SECRET=SCHOOL_SECRET_KEY
   FRONTEND_URL=http://localhost:3002
   BACKEND_URL=http://192.168.31.110:3000
   PDF_LOGO_PATH=src/assets/logo.png
   PDF_HEADER_PATH=src/assets/header.png
   PDF_FOOTER_PATH=src/assets/footer.png
   STUDENT_JWT_SECRET=STUDENT_SECRET_KEY
   ```
2. Start server:
   ```
   npm run dev
   ```
