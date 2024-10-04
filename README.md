# Task Management System with Ontrack Integration (TMSWOI)

## Overview

A Task Management System with OnTrack integration is a software tool that helps individuals to efficiently organize, prioritize, and track tasks. It often contains features like as task creation, assignment, progress tracking, deadlines all with the goal of increasing productivity. OnTrack Integration enhances a task management system by enabling sophisticated tracking and reporting capabilities. It allows users to track assignments progress in real time, enabling them meet deadlines and manage workload distribution. By incorporating OnTrack, the task management system becomes a more effective tool for improving efficiency and responsibility.

## Features

- **User Authentication**: Secure login system with bcrypt password hashing for enhanced security.
- **Task Management**: Add, update, and delete tasks with ease. Set due dates and priorities for tasks to stay organized.
- **Ontrack Integration**: Seamless integration with Ontrack for real-time tracking of project progress.
- **Responsive UI**: Built with Materialize CSS to ensure a mobile-friendly and visually appealing interface.
- **Database Integration**: Utilizes MongoDB for efficient task storage and retrieval.
- **API Integration**: Node.js and Express.js used to create RESTful API endpoints for managing tasks.
- **Testing**: Four test cases implemented using Supertest for login scenarios, ensuring the system’s robustness and security.

## Tech Stack

- **Frontend**: HTML, Materialize CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Testing**: Supertest
- **Version Control**: Git
- **Authentication**: bcrypt

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sooraj126/TMSWOI.git
   ```

2. Navigate into the project directory:
   ```bash
   cd TMSWOI
   ```

3. Install dependencies:
   ```bash
   npm install
   npm install socket.io
   npm install socket.io-client
   ```

4. Set up your environment variables. Create a `.env` file in the root directory and add the following:
   ```bash
   MONGO_URI=your_mongo_db_uri
   PORT=your_preferred_port
   ```

5. Start the server:
   ```bash
   npm server.js
   ```

6. Open your browser and go to `http://localhost:<PORT>` to access the application.

## Detailed Features

### 1. **Sign up/Login System**
   - **Secure Registration**: New users can create an account by providing essential details such as username, email, and password. Passwords are hashed using bcrypt, ensuring that sensitive information is never stored in plain text.
   - **Authentication**: Once registered, users can log in using their credentials. The login process checks the stored hashed password to ensure security. Invalid credentials will prevent access.
   - **Session Management**: Upon successful login, a session is created to track the user's activities and maintain their authentication state across pages.

### 2. **Task Management**
   - **Creating Tasks**: Users can create new tasks by providing a task name, description, due date, and priority. Each task is stored in the database for retrieval and future updates.
   - **Updating Tasks**: Tasks can be edited to reflect changes in requirements, deadlines, or priority. Users can modify the task details and resave the task.
   - **Deleting Tasks**: Unnecessary or completed tasks can be deleted from the system. This keeps the task list clean and relevant.
   - **Task Prioritization**: Tasks can be categorized by priority, helping users focus on critical tasks first.
   - **Task Status Updates**: Mark tasks as completed or in-progress to visually track the status of various projects.

### 3. **Ontrack Integration**
   - **Project Tracking**: Ontrack integration allows for real-time synchronization between the task management system and Ontrack. Users can track the overall progress of their projects from within the TMSWOI interface.
   - **Real-time Updates**: Any changes made to tasks are reflected immediately in Ontrack, ensuring that both systems remain in sync.
   - **Seamless Workflow**: The integration provides a streamlined approach to project management by bridging the gap between task tracking and project-wide goals, offering users a complete view of their project status.
   - **Project Milestones**: Users can set and monitor milestones through Ontrack, ensuring that their tasks align with the larger project objectives.

## Testing

To run the tests, use the following command:
```bash
	npm test
```

## Usage

1. **Sign up/Login**: Use the secure login system to create an account and log in.
2. **Task Management**: Create new tasks, update or delete them as necessary.
3. **Ontrack Integration**: Track the progress of your tasks and projects in real-time with Ontrack.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
