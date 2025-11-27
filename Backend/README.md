# MentorMatch Backend API

Production-grade REST API for the MentorMatch platform built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Role-based access control (Mentor/Student)
- Session management
- Payment processing
- Review and rating system
- Skills matching

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT authentication
- Bcrypt password hashing
- Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mentormatch
JWT_SECRET=your_secure_jwt_secret_key_here
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/user/me` - Get current user profile
- `PATCH /api/user/me` - Update current user

### Mentors
- `GET /api/mentors` - Get all mentors (with filters)
- `GET /api/mentors/carousel` - Get top mentors for carousel
- `GET /api/mentors/:id` - Get mentor by ID
- `GET /api/mentors/skill/:skillId` - Get mentors by skill

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `GET /api/skills/mentor/:mentorId` - Get mentor skills
- `POST /api/skills/mentor/:id/skills` - Add skills to mentor
- `DELETE /api/skills/mentor/:mentorId/skills/:skillId` - Remove skill from mentor

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions` - Get sessions by role
- `GET /api/sessions/:id` - Get session by ID
- `PATCH /api/sessions/:id/status` - Update session status

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment by ID
- `PATCH /api/payments/:id/status` - Update payment status
- `GET /api/payments/session/:sessionId` - Get payments by session

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews?mentor=:mentorId` - Get reviews by mentor
- `GET /api/reviews/:id` - Get review by ID

## Project Structure

```
Backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── auth.controller.js
│   ├── mentor.controller.js
│   ├── payments.controller.js
│   ├── reviews.controller.js
│   ├── session.controller.js
│   ├── skills.controller.js
│   └── user.controller.js
├── middleware/
│   └── auth.middleware.js # JWT authentication
├── models/
│   ├── mentorSkills.model.js
│   ├── payment.model.js
│   ├── review.model.js
│   ├── Session.model.js
│   ├── skill.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── mentor.routes.js
│   ├── payments.routes.js
│   ├── reviews.routes.js
│   ├── session.routes.js
│   ├── skills.routes.js
│   └── user.routes.js
├── utils/
│   └── generateToken.js
├── .env.example
├── index.js
└── package.json
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Security

- Password hashing with bcrypt
- JWT token authentication
- Environment variable protection
- CORS configuration
- Input validation with Zod

## Author

Arsh Chauhan
