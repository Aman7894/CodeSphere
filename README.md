# Collaborative Code Editor with Multi-Language Execution

A powerful, real-time collaborative code editor allowing multiple users to edit the same codebase simultaneously while communicating seamlessly. Built with a modern tech stack, this application features secure authentication, interactive code execution across multiple languages, and a beautiful sleek UI.

---

## 🚀 Key Features and Technologies Used

### 1. **Real-time Collaborative Editing**
- **Feature**: Multiple users can join a "Room" via a shared link and edit code together in real time. Remote cursors, presence indicators, and changes are instantly synchronized.
- **Technologies**: 
  - **Frontend**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (The engine powering VS Code) + `y-monaco` bindings.
  - **State Synchronization**: [Yjs](https://yjs.dev/) (A CRDT framework) for conflict-free distributed states.
  - **Networking**: `y-socket.io` running over Websockets, establishing a persistent connection between clients and the Node.js backend.

### 2. **Authentication System (OAuth & Local)**
- **Feature**: Users must log in to access the collaboration space. Supports traditional email/password and secure OAuth integrations.
- **Technologies**:
  - **Local Auth**: JWT (JSON Web Tokens) and bcrypt for password hashing.
  - **OAuth Providers**: [Google](#) and [GitHub](#) single sign-on powered by [Passport.js](http://www.passportjs.org/).
  - **Database**: MongoDB (via Mongoose) to store user credentials, avatars, and OAuth mappings securely.

### 3. **Local Multi-Language Code Execution Engine**
- **Feature**: Directly execute Python, Java, C++, and C code. Allows passing custom `stdin` inputs and retrieving standard output (`stdout`), standard error (`stderr`), process exit codes, and execution timings.
- **Technologies**:
  - Node.js native `child_process.spawn` on the backend.
  - Runs secure, isolated executions in temporary directories via OS temporary storage (`os.tmpdir()`).
  - Strict 10-second timeout constraints to kill infinite loops dynamically without bringing down the server.

### 4. **Modern UI and Workspace**
- **Feature**: Premium, responsive glass-morphic UI, matching modern IDE aesthetics (e.g. VS Code dark mode).
- **Technologies**:
  - **Frontend Framework**: React 18 powered by [Vite](https://vitejs.dev/) (Port `4000`).
  - **Styling**: Tailwind CSS for rapid prototyping and sleek utilities.
  - **Icons**: Lucide React for consistent vector iconography.
  - **Toast Notifications**: `react-hot-toast` for clipboard copying and error alerts.

---

## 🔄 System Architecture and Flow Diagram

Below is the Flow Diagram visualizing the complete project lifecycle:

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [React Frontend (Vite) - Port 4000]
        login[Login / Signup Page]
        editor[Editor Page]
        navbar[Navbar: Language, Share, Run]
        term[Output Terminal & Stdin]
    end

    %% Backend Layer
    subgraph Backend [Node.js / Express Backend - Port 3000]
        authRoutes[Auth Routes: Google/Github/Local]
        passport(Passport.js / JWT)
        socket[Socket.io + Yjs CRDT Websockets]
        execEngine[codeController - child_process.spawn]
    end

    %% Infrastructure & Compilers
    subgraph Infra [Database & Compilers]
        db[(MongoDB)]
        compilers[Local Compilers: Python, Javac, GCC, G++]
    end

    %% Auth Flow
    login --> |OAuth / Passwords| authRoutes
    authRoutes --> passport
    passport <--> |Verify / Save| db
    passport --> |Returns JWT Token| login

    %% Room Access Flow
    login --> |Redirects to Room| editor
    editor --> |Establishes Connection| socket
    socket <--> |Syncs Document State| editor

    %% Execution Flow
    navbar --> |Clicks Run| execEngine
    term --> |Sends Stdin| execEngine
    execEngine --> |Spawns Process / Temporary Files| compilers
    compilers --> |Returns Output / Timeout| execEngine
    execEngine --> |JSON Response| term
```

---

## ⚙️ How It Works (Step by Step)

1. **Accessing the App**: The user accesses the `localhost:4000` application. Navigating the client fires React Router rendering logic.
2. **Authentication**: 
   - If not authenticated, users are redirected to `/login`.
   - Google/GitHub buttons trigger top-level window redirects to `/api/auth/google` (or GitHub).
   - Once authenticated, the backend yields a JWT token securely placed into HTTP cookies, and redirects back to the frontend's `/auth-success` callback securely.
3. **Entering a Room**: 
   - The user visits an Editor path like `/editor/abc-123`.
   - The frontend's Yjs provider initializes a websocket stream pointing to the backend's `y-websocket` initialization pool.
   - The user's metadata (Name & Avatar) is broadcast to all active connections in real-time.
4. **Code Execution**: 
   - When the user selects a language (e.g. `C++`) and clicks **Run**, React wraps the `editor context + language rules + stdin text` into an HTTP POST request to `/api/code/execute`.
   - The backend validates the user's JWT. Upon success, it writes the code into a random temporary directory (e.g., `main.cpp`).
   - The backend uses `child_process` to trigger `g++` compilation, followed by `./output.exe` execution.
   - All standard terminal output buffers (`stdout/stderr`) are captured and sent back as a unified string to be displayed on your Editor Page terminal.

---

## 🛠️ Setup and Installation

### Requirements
- Node.js v18+
- MongoDB Installed / Available (Local or Atlas)
- Installed System Compilers globally attached to system PATH (`python`, `javac`, `java`, `gcc`, `g++`).

### Installation
1. Start the backend:
```bash
cd backend
npm install
npm run dev # Starts nodemon server on port 3000
```
2. Start the frontend:
```bash
cd frontend
npm install
npm run dev # Starts Vite server on port 4000
```
