# Task Master Pro 🚀

A high-performance, minimalist task management dashboard built with **React**. This project focuses on modern UI patterns, efficient state management, and optimized rendering cycles.

## ✨ High-Impact Features
* **Progress Analytics:** Real-time calculation of completion percentages using derived state logic to monitor productivity at a glance.
* **Memoized Search & Filtering:** A high-performance filtering system (All/Active/Completed) optimized with `useMemo` to ensure zero lag during interaction.
* **Undo Functionality:** Enhanced UX through a "Soft Delete" pattern, allowing users to restore accidentally deleted tasks via a non-blocking toast notification.
* **Task Prioritization:** Integrated priority levels (High/Medium/Low) to help users organize their workflow effectively.
* **Persistence Layer:** Robust integration with Browser LocalStorage, featuring error handling to ensure data integrity across sessions.
* **Responsive Design:** A mobile-first, modern UI with support for both Dark and Light modes.

## 🛠️ Technical Stack
* **Framework:** React (Vite)
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`, `useMemo`)
* **Styling:** Modern CSS (CSS Variables, Flexbox, Mobile-First Design)
* **Safety:** `crypto.randomUUID()` for unique indexing and `try/catch` for data parsing.

## 🚀 Why This Project Stands Out
Instead of just basic CRUD (Create, Read, Update, Delete) operations, this project implements professional engineering patterns:
1. **Performance Optimization:** Prevented unnecessary re-renders and re-calculations using React optimization hooks.
2. **User-Centric Design:** Focused on "Error Prevention" by adding an Undo feature rather than intrusive confirmation pop-ups.
3. **Clean Architecture:** Separated business logic (filtering/sorting) from the UI components for better maintainability.

## 📥 Getting Started
1. Clone the repository: 
   ```bash
   git clone [https://github.com/vasanth038/todo-app.git](https://github.com/vasanth038/todo-app.git)
