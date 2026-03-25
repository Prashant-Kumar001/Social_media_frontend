# 🌐 Social Media App — Frontend Documentation

## 📌 Overview

This is a modern social media web application built using React and TypeScript. The frontend is designed for scalability, performance, and a smooth user experience similar to platforms like Instagram and WhatsApp.

---

## 🚀 Tech Stack

* **Framework:** React (with Vite)
* **Language:** TypeScript
* **Routing:** React Router
* **State Management:** React Hooks
* **Authentication:** Clerk
* **API Communication:** Axios
* **Styling:** Tailwind CSS
* **Date Handling:** date-fns

---

## 📁 Project Structure

```
src/
 ├── api/                # Axios base configuration
 ├── assets/             # Static data & types
 ├── components/         # Reusable UI components
 ├── pages/              # Application pages
 ├── hooks/              # Custom hooks
 ├── utils/              # Utility functions
 └── App.tsx             # Main app component
```

---

## 🔐 Authentication

Authentication is handled using Clerk.

### Features:

* Secure login/signup
* Token-based authentication
* User session management

### Example:

```ts
const { user } = useUser();
const { getToken } = useAuth();
```

---

## 📡 API Handling

All API requests are handled using a centralized Axios instance.

### Example:

```ts
const res = await api.get('/endpoint', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 💬 Messaging System

### Features:

* Real-time-like recent messages (polling)
* Message grouping by user
* Sorted by latest activity
* Seen/unseen indicator

### Key Logic:

* Messages are grouped by sender
* Latest message per sender is displayed
* Sorted using timestamps

---

## ⏱️ Polling System

Currently, the app uses polling to fetch updates every 30 seconds.

### Implementation:

```ts
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

useEffect(() => {
  intervalRef.current = setInterval(fetchData, 30000);
  return () => clearInterval(intervalRef.current!);
}, []);
```

---

## 🎨 UI & Styling

* Built with Tailwind CSS
* Responsive design
* Clean and minimal layout

### Components:

* Chat list
* Profile avatar
* Notification indicators

---

## 😀 Emoji Support

* Supports native emoji input
* Can be extended using emoji picker libraries

---

## ⚡ Performance Optimizations

* useCallback for memoized functions
* useEffect dependency control
* Efficient list rendering with keys

---

## 🔮 Future Improvements

* WebSocket (Socket.io) for real-time updates
* Typing indicators
* Online/offline status
* Push notifications
* Media uploads optimization

---

## 🧪 Development Tips

* Always type API responses
* Avoid using index as key in lists
* Handle null/undefined safely
* Use reusable components

---

## 📦 Setup Instructions

```bash
npm install
npm run dev
```

---

## 🤝 Contribution

Feel free to contribute by improving UI, adding features, or optimizing performance.

---

## 📄 License

This project is for educational and personal use.

---

🔥 Built with passion to create a scalable social media platform.
