# 📱 Accelerometer Examination

![GitHub Commit Activity](https://img.shields.io/github/commit-activity/m/retreat896/Mobile-Accelerometer-Exam?color=blue&logo=github) ![Last Commit](https://img.shields.io/github/last-commit/retreat896/Mobile-Accelerometer-Exam?color=green)

### 🧭 Exploring Motion Sensors with React Native & Expo

This project demonstrates the power of a mobile device’s **Accelerometer** and **Gyroscope** through an interactive, multi-screen React Native (Expo) application. Developed as part of **CS3720 Mobile Application Development (Fall 2025)** under the guidance of **Dr. Abraham Aldaco** at **UW Platteville**.

---

## 🎯 Objective

> To build a modular, multi-screen React Native app that leverages **Expo Router** and the device’s **motion sensors** for creative interaction and visualization.

The app provides:

-   A 3D geometry & material showcase 🎨
-   A gravity-based ball playground ⚽
-   A creative sensor experience designed by students 💡

---

## 🧩 Features

| Screen                              | Description                                                                                                                                                 |
| :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🧱 **Geometry & Material Showcase** | Display and manipulate 3D shapes and materials in real time using Three.js (`expo-three`). Includes live accelerometer data in the footer.                  |
| ⚾ **Ball Gravity Playground**      | A fun 2D ball simulation where tilt motion moves the ball! Includes damping, collisions, and customization controls (color/size).                           |
| 🧠 **Creative Sensor App**          | Your imagination in motion — a custom experience powered by accelerometer/gyroscope input. Examples: Tilt-Dodger mini-game, shake counter, or bubble level. |

---

## 🛠️ Tech Stack

-   ⚛️ **React Native** (via Expo)
-   🧭 **Expo Sensors** (Accelerometer, Gyroscope)
-   🧩 **Expo Router** for file-based navigation
-   🎨 **expo-three / three.js** for 3D rendering
-   💅 **Modularized styles** shared across components

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/retreat896/Mobile-Accelerometer-Exam.git
cd Mobile-Accelerometer-Exam
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Build the App

```bash
npx run android
```

🪟 Wait for it to build and open.

---

### 4️⃣ Run the App

```bash
ctrl+c <---- Close Previous Execution
npx run start
```

📱 Using the Keyboard controls in Expo, launch the application in android using the 'a" Key

---

## 📂 Project Structure

```
Mobile-Accelerometer-Exam/
├── app/
│   ├── index.jsx              # Home Screen
│   ├── geometry.jsx           # 3D Showcase
│   ├── gravity.jsx            # Ball Playground
│   ├── custom.jsx             # Custom Sensor App
├── components/                # Reusable UI Components
├── modules/                   # Shared logic (e.g., sensor handlers)
├── styles/                    # Reusable StyleSheets
├── assets/                    # Images & static resources
├── package.json
├── app.json
├── .gitignore
└── README.md
```

---

## 🧠 Learning Outcomes

✅ Implement multi-screen navigation with **Expo Router** ✅ Integrate and visualize **accelerometer/gyroscope** data ✅ Create modularized, reusable components ✅ Document **Generative AI** assistance responsibly ✅ Build sensor-driven UI experiences in real time

---

## 🤖 Generative AI Acknowledgment

-   Readme.md Formatting help. TODO

---

## 🤝 Contributors

| Name                | Role                 | Email                                               |
| :------------------ | :------------------- | :-------------------------------------------------- |
| 👩‍💻 Kristopher Adams | Developer / Designer | [adamskri@uwplatt.edu](mailto:adamskri@uwplatt.edu) |
| 👨‍💻 Jacob Malland    | Developer / Tester   | [mallandj@uwplatt.edu](mailto:mallandj@uwplatt.edu) |

---

## 📊 Commit Graph & Insights

### 🔍 Contribution Overview

![GitHub Commit Activity](https://img.shields.io/github/commit-activity/m/retreat896/Mobile-Accelerometer-Exam?color=blue&logo=github) ![Last Commit](https://img.shields.io/github/last-commit/retreat896/Mobile-Accelerometer-Exam?color=green)

### 📈 Graphs & Analytics

[ ![GitHub Graphs](https://github-readme-activity-graph.vercel.app/graph?username=retreat896&repo=Mobile-Accelerometer-Exam&theme=react-dark)](https://github.com/retreat896/Mobile-Accelerometer-Exam)

[ ![GitHub Graphs](https://github-readme-activity-graph.vercel.app/graph?username=JMalland&repo=Mobile-Accelerometer-Exam&theme=react-dark)](https://github.com/reteat896/Mobile-Accelerometer-Exam)

---

## 🧾 Appendix

-   📘 Course: CS3720 Mobile Application Development
-   🧑‍🏫 Instructor: Dr. Abraham Aldaco
-   🗓️ Term: Fall 2025
-   🧩 Assignment: Exam 1 – Accelerometer and Gyroscope in Physical Device (Live Mode)

---

## 🏁 License

This project is for **educational purposes only** as part of **UW Platteville CS3720 coursework**. Feel free to explore, fork, and learn from it — creativity encouraged! 🚀

---

⭐ **If you found this project interesting, give it a star on GitHub!** ⭐
