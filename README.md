# Mealy-to-Moore-Machine-Converter
## 📌 Project Description
This project is a simulation tool that converts a Mealy machine into its equivalent Moore machine. Users can upload an image of a Mealy machine (transition diagram or table), and the system will extract its components and generate the corresponding Moore machine. The actual conversion is handled by a dedicated converter tool, while AI agents assist in utilizing this tool efficiently. The output includes the converted transition table and a visual state diagram.

## 🎯 Objectives
- Convert Mealy machines to Moore machines using a dedicated converter tool.  
- Use AI agents to automate the process of interpreting input and interacting with the tool.  
- Provide a user-friendly interface for uploading Mealy machine diagrams.  
- Visualize both the original and converted machines clearly.

## 🧠 Concepts Covered
- Deterministic Finite Automata (DFA)  
- Mealy Machines  
- Moore Machines  
- State Transition Tables

## 🔧 Functional Features
- Upload image of Mealy machine.  
- AI agent processes the input and uses the converter tool.  
- Display of Moore machine transition table and visual diagram.

## ⚙️ Tech Stack
- **Python** – backend logic & conversion algorithm  
- **Crew AI Agent** – interface automation and logic assistance  
- **Next.js** – frontend interface  
- **Graphviz / Matplotlib** – state diagram visualization (optional)

## ⚠️ Challenges
- State explosion during conversion  
- Output assignment conflicts  
- Diagram parsing and accurate extraction

*Mitigation:* Modular conversion logic, AI-assisted input handling, and proven visualization libraries.

## 📚 References
- *Hopcroft et al.*, _Introduction to Automata Theory_  
- TutorialsPoint – Mealy and Moore Machines  
- GeeksforGeeks – Mealy to Moore Conversion  
- Automata Theory Lecture Slides
