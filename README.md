# Municipal Issue Management System

A full-stack AI-powered application for managing community service requests with real-time notifications, built with microservices architecture and React Module Federation.

## 🎯 Project Overview

This system enables residents to report municipal issues (potholes, streetlight outages, etc.), allows city staff to manage and resolve them, and provides community advocates with AI-powered trend insights. The application features automatic issue categorization, urgency scoring, and real-time notifications.

## 👥 Team Members & Roles

- **Backend Development**: Microservices architecture, GraphQL APIs, Socket.io integration
- **Frontend Development**: React Module Federation, UI/UX design, responsive layouts
- **AI Integration**: LangGraph state machine, Google Gemini API, RAG implementation
- **Database Management**: MongoDB schemas, data modeling, embeddings storage
- **DevOps**: Service orchestration, environment configuration, deployment

## 🏗️ Architecture

### Backend Microservices
- **Auth Service** (Port 4001): JWT authentication, user management
- **Issue Management Service** (Port 4002): CRUD operations, Socket.io notifications
- **Analytics-AI Service** (Port 5005): LangGraph AI, trend analysis, RAG with embeddings

### Frontend Applications
- **Shell App** (Port 3000): Main Module Federation host
- **User App** (Port 3001): Authentication module
- **Issue App** (Port 3002): Issue management module

### Technology Stack

**Backend:**
- Node.js & Express
- GraphQL with Apollo Server
- MongoDB (Mongoose)
- Socket.io (Real-time notifications)
- LangGraph (AI state machine)
- Google Gemini API (AI model)

**Frontend:**
- React 18.2
- Vite (Module Federation)
- Bootstrap 5
- React Router
- Apollo Client (GraphQL)
- Socket.io Client

**AI/ML:**
- LangGraph for multi-step reasoning
- Google Gemini 2.5 Flash
- Cosine similarity for RAG
- SQLite for chat history

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or connection string
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/riponcc/Group4COMP308Project.git
cd Group4COMP308Project
```

2. **Install backend dependencies**
```bash
cd server/microservices/auth-service
npm install

cd ../issue-management-service
npm install

cd ../analytics-ai-service
npm install
```

3. **Install frontend dependencies**
```bash
cd ../../../client/shell-app
npm install

cd ../user-app
npm install

cd ../issue-app
npm install
```

4. **Configure environment variables**

Create `.env` files in each microservice:

**server/microservices/auth-service/.env**
```env
AUTH_SERVICE_PORT=4001
MONGODB_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=fallback_secret
```

**server/microservices/issue-management-service/.env**
```env
ISSUE_SERVICE_PORT=4002
MONGODB_URI=mongodb://localhost:27017/issues-db
JWT_SECRET=fallback_secret
```

**server/microservices/analytics-ai-service/.env**
```env
ANALYTICS_AI_PORT=5005
MONGODB_URI=mongodb://localhost:27017/issues-db
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

### Running the Application

**Start all backend services:**

```bash
# Terminal 1 - Auth Service
cd server/microservices/auth-service
node auth-microservice.js

# Terminal 2 - Issue Management Service
cd server/microservices/issue-management-service
node issue-microservice.js

# Terminal 3 - Analytics-AI Service
cd server/microservices/analytics-ai-service
node analytics-ai-microservice.js
```

**Start all frontend applications:**

```bash
# Terminal 4 - Shell App (Development)
cd client/shell-app
npm run dev

# Terminal 5 - User App (Preview)
cd client/user-app
npm run preview

# Terminal 6 - Issue App (Preview)
cd client/issue-app
npm run preview
```

**Access the application:**
Open your browser to `http://localhost:3000`

## 📱 Features

### For Residents
- ✅ Register and login with secure JWT authentication
- ✅ Submit issues with title, description, location, and photo
- ✅ Track submitted issues with status filters
- ✅ Receive real-time notifications on status updates
- ✅ Chat with AI assistant for guidance

### For Municipal Staff
- ✅ View all reported issues in one dashboard
- ✅ Update issue status (Open → In Progress → Resolved → Closed)
- ✅ View analytics dashboard with statistics
- ✅ Get AI-powered trend summaries
- ✅ Access AI chatbot for insights

### For Community Advocates
- ✅ View community discussion board
- ✅ Analyze trends with AI-powered insights
- ✅ Track all AI chatbot queries
- ✅ View comprehensive statistics
- ✅ Export data for reporting

### AI Features
- 🤖 Automatic issue categorization (roads, lighting, flooding, etc.)
- 🎯 Intelligent urgency scoring (1-5 scale)
- 💬 Conversational AI chatbot for all roles
- 📊 Trend analysis with embeddings and RAG
- 🧠 Context-aware responses using chat history

## 🎨 UI/UX Design

- **Dark Theme**: Professional black (#0d0d0d) background throughout
- **High Contrast**: White text (#ffffff) with colored accents
- **Accessibility**: Bold headings, large fonts, clear visual hierarchy
- **Responsive**: Works seamlessly on desktop and mobile
- **Real-time**: Instant toast notifications for all events

## 📊 API Endpoints

### Auth Service (GraphQL - Port 4001)
```graphql
mutation SignUp($username: String!, $password: String!, $role: String!)
mutation Login($username: String!, $password: String!)
query Me
```

### Issue Management Service (GraphQL - Port 4002)
```graphql
mutation CreateIssue($input: IssueInput!)
mutation UpdateIssueStatus($id: ID!, $status: String!)
query Issues($filter: IssueFilter)
query Issue($id: ID!)
```

### Analytics-AI Service (REST - Port 5005)
```
POST /ai/query - Chat with AI assistant
POST /ai/summary - Get trend summary
GET /ai/chat-history - Retrieve chat history
```

## 🔒 Security

- JWT-based authentication across all services
- Password hashing with bcrypt
- Protected GraphQL resolvers
- CORS configuration for frontend access
- Environment variable protection for API keys

## 🧪 Testing

**Test user accounts:**
- Resident: `resident1` / password
- Staff: `staff1` / password  
- Advocate: `advocate1` / password

## 📈 Project Statistics

- **3** Microservices
- **3** Frontend modules with Module Federation
- **2** Databases (MongoDB + SQLite)
- **Real-time** Socket.io notifications
- **AI-powered** with Google Gemini API
- **GraphQL** for flexible data queries

## 🚧 Known Limitations

- Google Gemini API free tier: 20 requests per day
- Quota errors handled with user-friendly messages
- Photo uploads stored as URLs (external hosting required)

## 🔮 Future Enhancements

- [ ] Interactive map with geolocation
- [ ] Mobile app (React Native)
- [ ] Predictive analytics for issue resolution times
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Multi-language support
- [ ] Export reports to PDF
- [ ] Integration with city databases

## 📝 License

This project is developed for COMP308-001 course at Centennial College.

## 🤝 Contributing

This is a course project. For any questions or suggestions, please contact the team members.

## 📞 Support

For issues or questions about this project, please open an issue in the GitHub repository.

---

**Built with ❤️ by Group 4 - COMP308-001**
