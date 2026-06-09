```text
________  .____________       .__              __               .__         
\______ \ |__\______   \ ____ |  | _____      |__|____ _______  |__| ____   
 |    |  \|  ||    |  _// __ \|  | \__  \     |  \__  \\_  __ \ |  |/    \  
 |    `   \  ||    |   \  ___/|  |__/ __ \_   |  |/ __ \|  | \/ |  |   |  \ 
/_______  /__||______  /\___  >____(____  /\__|  (____  /__| /\ |__|___|  / 
        \/           \/     \/          \/\______|    \/     \/         \/  
   _____ __________.___                                                     
  /  _  \\______   \   |                                                    
 /  /_\  \|     ___/   |                                                    
/    |    \    |   |   |                                                    
\____|__  /____|   |___|                                                    
        \/                                                                  
```

<div align="center">
  <p align="center">
    <a href="https://github.com/fredyyfajarr/DiBelajar.in-NodeJs-Backend/issues">
      <img src="https://img.shields.io/github/issues/fredyyfajarr/DiBelajar.in-NodeJs-Backend?style=for-the-badge&color=orange" alt="Issues" />
    </a>
    <a href="https://github.com/fredyyfajarr/DiBelajar.in-NodeJs-Backend/pulls">
      <img src="https://img.shields.io/github/issues-pr/fredyyfajarr/DiBelajar.in-NodeJs-Backend?style=for-the-badge&color=orange" alt="Pull Requests" />
    </a>
    <a href="https://github.com/fredyyfajarr/DiBelajar.in-NodeJs-Backend/stargazers">
      <img src="https://img.shields.io/github/stars/fredyyfajarr/DiBelajar.in-NodeJs-Backend?style=for-the-badge&color=orange" alt="Stars" />
    </a>
  </p>
</div>

## Table of Contents
- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License / Copyright](#license--copyright)

## About The Project

DiBelajar.in API is a comprehensive e-learning backend platform designed to power modern digital education. It provides a robust architecture to manage instructors, students, course catalogs, enrollment workflows, and interactive learning materials. Designed for scalability and performance, this backend effectively bridges the gap between educational content delivery and student progress tracking.

This project employs a well-structured layered architecture separating routes, controllers, services, and validation logic. With built-in features such as forum posts, assignment submissions, test results, and rich analytics, the DiBelajar.in API stands as an enterprise-grade foundation for any EdTech solution.

## Key Features

- **Advanced Course Management:** Support for dynamic categories, structured course materials, and detailed syllabus tracking.
- **Student Enrollment System:** Streamlined enrollment workflows for users, linking students securely to their purchased or subscribed courses.
- **Interactive Engagements:** Built-in models and routes for Forum Posts and Course Reviews to foster a community learning environment.
- **Assessment & Tracking:** Endpoints to manage Assignment Submissions and track Test Results, giving instructors actionable insights.
- **Layered Service Architecture:** Clean separation of concerns with dedicated `services` for business logic, `controllers` for HTTP flow, and `validation` utilizing Joi/express-validator.
- **Analytics & Stats:** Dedicated analytics endpoints to retrieve platform usage, enrollment metrics, and course popularity.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Architecture:** Controller-Service-Repository Pattern
- **Authentication:** JWT & HttpOnly Cookie Management
- **File Uploads:** Multer for handling assignment and avatar uploads
- **Email Delivery:** Custom NodeMailer configurations

## Project Structure

```text
DiBelajar.in-NodeJs-Backend/
├── controllers/          # HTTP request handlers and response formatting
├── middlewares/          # Custom auth, error handling, and ownership checks
├── models/               # Mongoose schemas (Course, User, Enrollment, Assignment, etc.)
├── routes/               # Express routing (including nested routes)
├── services/             # Core business logic isolating DB interactions
├── validation/           # Schema validations for incoming requests
├── utils/                # Utilities for API response, email, and queries
├── scripts/              # Seeders and database migration utilities
├── tests/                # Unit and integration test files
├── server.js             # Main application entry point
└── package.json          # Dependencies and script definitions
```

## Getting Started

### Prerequisites
- Node.js (v18.x or later)
- MongoDB instance (Local or Atlas)
- NPM or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fredyyfajarr/DiBelajar.in-NodeJs-Backend.git
   ```
2. Navigate into the directory:
   ```bash
   cd DiBelajar.in-NodeJs-Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure your `.env` variables matching the required configuration (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).

## Usage

1. To run the development server:
   ```bash
   npm run dev
   ```
2. For database seeding with initial courses and users:
   ```bash
   npm run seed
   ```
3. API Documentation (if integrated) can typically be found at `/api-docs` or refer to the individual router files to explore available endpoints.

## Contributing

We welcome contributions to improve DiBelajar.in! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License / Copyright

Copyright &copy; 2026 Fredy Fajar Adi Putra. All Rights Reserved.
