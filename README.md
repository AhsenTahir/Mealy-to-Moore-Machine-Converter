# Mealy-to-Moore-Machine-Converter

## 📌 Project Description
A modern web-based tool that provides bidirectional conversion between Mealy and Moore machines. The application features a clean, intuitive interface for inputting machine descriptions and visualizes both the original and converted machines in an interactive format. The conversion logic is implemented in Python with a FastAPI backend, while the frontend is built using Next.js with a sleek, responsive design.

## 🎯 Objectives
- Provide bidirectional conversion between Mealy and Moore machines
- Offer a modern, user-friendly web interface for machine input and visualization
- Ensure accurate and efficient conversion algorithms
- Present clear, readable transition tables for both machine types

## 🧠 Concepts Covered
- Deterministic Finite Automata (DFA)
- Mealy Machines
- Moore Machines
- State Transition Tables
- Bidirectional FSM Conversion

## 🔧 Functional Features
- Text-based input for both Mealy and Moore machines
- Bidirectional conversion (Mealy ↔ Moore)
- Interactive transition table visualization
- Real-time error handling and validation
- Responsive web interface with dark mode
- Clear presentation of both original and converted machines

## ⚙️ Tech Stack
- **Backend:**
  - Python with FastAPI
  - Custom conversion algorithms
  - CORS middleware for secure API access
- **Frontend:**
  - Next.js
  - React with TypeScript
  - Motion animations
  - Tailwind CSS for styling
- **API:**
  - RESTful endpoints for conversions
  - JSON-based data exchange
  - Error handling and validation

## 🚀 Input Format
### Mealy to Moore:
- Each line represents transitions for a state
- Format: `next_state output` pairs for each input
- Example:
  ```
  1 0 2 1
  2 1 0 0
  ```

### Moore to Mealy:
- First line: outputs for each state
- Subsequent lines: transition table
- Example:
  ```
  0 1 0
  1 2 0
  2 0 1
  0 1 2
  ```

## ⚠️ Challenges & Solutions
- **State Explosion:** Optimized state mapping algorithm
- **Input Validation:** Comprehensive error checking and user feedback
- **UI/UX:** Modern, responsive design with clear visualization
- **Type Safety:** TypeScript implementation for robust frontend code

## 📚 References
- *Hopcroft et al.*, _Introduction to Automata Theory_
- TutorialsPoint – Mealy and Moore Machines
- GeeksforGeeks – Mealy to Moore Conversion
- Automata Theory Lecture Slides

## 👨‍💻 Contributors
- Frontend UI Design: @mustafahk27
