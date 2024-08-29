## Learning Repository for NestJS and PostgreSQL

This repository is a learning project that explores the fundamentals and advanced features of NestJS and PostgreSQL. The project also integrates several other technologies and tools to build a full-stack application:

- AWS S3: Handling file uploads and storage, including updating user avatars.
- Docker: Containerizing the application for consistent development and deployment environments.
- Elasticsearch: Implementing powerful search functionality.
- Guards: Securing routes and ensuring proper authorization within the application.

This project is a work in progress, and the main goal is to deepen my understanding of these technologies by building a comprehensive application that incorporates real-world features and practices.

## Setup

To run this project, you'll need to configure environment variables by following these steps:

1. **Rename the Environment Files:**
   - Rename `.env.example` to `.env`.
   - Rename `docker.env.example` to `docker.env`.

2. **Add Your AWS Credentials:**
   - In the `.env` file, add the following environment variables with your AWS credentials and bucket names:
     ```plaintext
     AWS_ACCESS_KEY_ID=
     AWS_SECRET_ACCESS_KEY=
     AWS_PUBLIC_BUCKET_NAME=
     AWS_PRIVATE_BUCKET_NAME=
     ```

3. **Start the Application:**
   - Run the following commands to start the application:
     ```bash
     pnpm i
     docker compose up -d
     pnpm run start:dev
     ```

