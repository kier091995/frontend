Task Management UI

INSTALL FIRST

npm install pinia
npm install axios
npm install socket.io-client

or 

npm install

Users can:
Add new tasks: Input a task name and its priority to add it to the list.

Mark a task as completed: Toggle between completed and pending states.

Delete a task: Admin users can delete tasks from the list.

Reorder tasks: Tasks can be reordered using drag-and-drop functionality.

Task Details:
Priority Display: Tasks will have colored labels based on their priority (Low, Medium, High).

Vue Transitions: Smooth transitions for when a task's completion status changes.

Task Reordering:
Tasks can be reordered using drag-and-drop. When the order changes, the new order is saved in the backend.

Task Filtering & Search
Users can filter tasks based on:

Status: All, Pending, Completed.

Priority: Low, Medium, High.

There’s also a search bar for searching tasks by title.

Responsive Design
The UI is mobile-friendly and adjusts according to the device's screen size. TailwindCSS's responsive utilities ensure the app looks great on:

Mobile

Tablet

Desktop

Authentication
The app uses Laravel Sanctum for authentication. The frontend implements login and logout functionality and stores the authentication state in Pinia. After logging in, users will have access to task management features, and admin users will have additional permissions, such as task deletion.

Login Flow:
On successful login, a session token is stored and used for authenticated requests.

Admin users can delete and manage tasks.

Required Features
Task Reordering:

Tasks can be reordered using drag-and-drop functionality.

The new task order is saved and persisted in the backend.

Real-Time Updates:

Tasks are updated in real-time using WebSockets.

Any updates to task status, addition, or deletion are immediately reflected on the UI.

Admin Dashboard:

Admin users can view all tasks and users and perform management tasks like deleting tasks or users.

Statistics for each user, such as the number of completed and pending tasks, are displayed.

API Documentation
Task Management API Endpoints:
GET /tasks: Fetch all tasks.

POST /tasks: Create a new task.

PUT /tasks/{id}: Update a task (e.g., mark as completed).

DELETE /tasks/{id}: Delete a task (admin only).

Authentication:
POST /login: Login using user credentials and retrieve a token.

POST /logout: Logout and invalidate the current session token.

WebSocket Events:
task-updated: Sent when a task is updated. This event is emitted to update the frontend in real-time.

task-deleted: Sent when a task is deleted. It will remove the task from the UI.
