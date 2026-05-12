# 🌸 HER — Heal · Excel · Renown

> A comprehensive PCOS & PCOD support web application built with the MERN Stack.

---

## 📋 About

**HER** is a full-stack web platform designed to empower women navigating Polycystic Ovary Syndrome (PCOS) and Polycystic Ovary Disorder (PCOD). The platform provides:

- 📊 **Symptom Tracker** — Daily logging of symptoms, mood, sleep, cycle & medications
- 📚 **Knowledge Hub** — Expert-reviewed articles on PCOS causes, diet, mental health & treatments  
- 💬 **Community Forum** — Safe space to share stories, ask questions, and support one another
- 📅 **Appointment Manager** — Track doctor visits and prepare questions
- 📈 **Health Dashboard** — Visualize personal health trends over time
- 👤 **User Profiles** — Personalized experience based on your condition & goals

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React 18, React Router v6, Axios     |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB + Mongoose                   |
| Auth      | JWT (JSON Web Tokens) + bcryptjs     |
| Styling   | Custom CSS with Design System        |

---

## 🗂️ Project Structure

```
her-app/
├── backend/
│   ├── models/
│   │   ├── User.js            # User schema (auth, profile, condition)
│   │   ├── Symptom.js         # Daily symptom log schema
│   │   ├── Article.js         # Health articles schema
│   │   ├── CommunityPost.js   # Forum posts + comments schema
│   │   └── Appointment.js     # Doctor appointment schema
│   ├── routes/
│   │   ├── auth.js            # Register, login, /me
│   │   ├── users.js           # Profile CRUD, save articles
│   │   ├── symptoms.js        # Symptom log CRUD + stats
│   │   ├── articles.js        # Article listing, likes
│   │   ├── community.js       # Posts, comments, likes
│   │   └── appointments.js    # Appointment CRUD
│   ├── middleware/
│   │   └── auth.js            # JWT protect + adminOnly middleware
│   ├── server.js              # Express app entry point
│   ├── seed.js                # Database seeder
│   └── .env.example           # Environment variables template
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js  # Global auth state + axios config
        ├── components/
        │   ├── Navbar.js       # Responsive navigation bar
        │   └── Navbar.css
        ├── pages/
        │   ├── Home.js         # Landing page with hero, features, CTA
        │   ├── Login.js        # Sign-in form
        │   ├── Register.js     # Sign-up form
        │   ├── Dashboard.js    # Personalized health overview
        │   ├── SymptomTracker.js # Full symptom logging interface
        │   ├── Articles.js     # Searchable, filterable article hub
        │   ├── Community.js    # Forum with posts & comments
        │   ├── Appointments.js # Appointment manager
        │   └── Profile.js      # User profile & settings
        ├── App.js              # Routes + AuthProvider wrapper
        ├── App.css             # Global design system & utilities
        └── index.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd her-app
```

### 2. Configure Backend Environment
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/her_app
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend & frontend dependencies
npm run install-all
```

### 4. Seed the Database (optional)
```bash
npm run seed
```
This creates sample users, articles, and posts.

**Demo Credentials:**
- Admin: `admin@her.com` / `admin123`
- User: `priya@example.com` / `priya123`

### 5. Run in Development
```bash
npm run dev
```
- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`

### 6. Production Build
```bash
npm run build
npm start
```

---

## 🔌 API Reference

### Auth Routes `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create new account | ❌ |
| POST | `/login` | Sign in | ❌ |
| GET | `/me` | Get current user | ✅ |

### User Routes `/api/users`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get full profile | ✅ |
| PUT | `/profile` | Update profile | ✅ |
| POST | `/save-article/:id` | Save/unsave article | ✅ |

### Symptom Routes `/api/symptoms`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create daily log | ✅ |
| GET | `/` | Get logs (with date filters) | ✅ |
| GET | `/stats` | Get symptom stats & trends | ✅ |
| PUT | `/:id` | Update entry | ✅ |
| DELETE | `/:id` | Delete entry | ✅ |

### Article Routes `/api/articles`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List published articles | ❌ |
| GET | `/:slug` | Get article by slug | ❌ |
| POST | `/:id/like` | Like/unlike | ✅ |
| POST | `/` | Create article | ✅ Admin |

### Community Routes `/api/community`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List posts | ❌ |
| POST | `/` | Create post | ✅ |
| POST | `/:id/like` | Like/unlike | ✅ |
| POST | `/:id/comment` | Add comment | ✅ |
| DELETE | `/:id` | Delete own post | ✅ |

### Appointment Routes `/api/appointments`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user appointments | ✅ |
| POST | `/` | Create appointment | ✅ |
| PUT | `/:id` | Update appointment | ✅ |
| DELETE | `/:id` | Delete appointment | ✅ |

---

## 🎨 Design System

The app uses a warm rose-plum color palette:

| Variable | Color |
|----------|-------|
| `--rose` | `#C9556B` (primary accent) |
| `--plum` | `#6B3D5E` (headings, nav) |
| `--gold` | `#D4956A` (highlights) |
| `--cream` | `#FFFAF7` (page background) |

Fonts: **Playfair Display** (headings) + **DM Sans** (body)

---

## 📌 Features Breakdown

### 🔐 Authentication
- JWT-based, stored in localStorage
- Protected routes via React context
- Token auto-attached via axios defaults

### 📊 Symptom Tracker
- 16 trackable symptoms with severity (1–5)
- Period tracking (flow, pain level)
- Mood, sleep hours, exercise logging
- Medication checklist
- History view with delete

### 📈 Dashboard
- Total entries count
- Upcoming appointments count
- Top symptom by frequency
- Exercise day count
- Symptom frequency bar chart
- Recent entries list
- Upcoming appointments

### 💬 Community
- Posts with categories, likes, comments
- Anonymous posting option
- Nested comment threads
- Sample posts included

### 📅 Appointments
- CRUD appointments with doctor info
- Status management (Upcoming/Completed/Cancelled)
- "Questions to Ask" prep list
- Doctor tips sidebar

---

## 🔮 Future Enhancements

- [ ] Email verification & password reset
- [ ] Push notifications for appointments
- [ ] AI-powered symptom insights
- [ ] Period cycle prediction
- [ ] Doctor directory integration
- [ ] Mobile app (React Native)
- [ ] Export health report as PDF
- [ ] Telemedicine booking

---

## 📖 References

- [PCOS Awareness Association](https://www.pcosaa.org/)
- [askPCOS.org](https://askpcos.org)
- [PCOS Sisters](https://pcossisters.com)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT © 2024 HER — Heal · Excel · Renown

---

*Built with ❤️ for every queen navigating PCOS & PCOD* 🌸
