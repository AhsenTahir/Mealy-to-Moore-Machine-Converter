from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from logic.moore_to_mealy import parse_moore_input, convert_to_mealy

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class MealyInput(BaseModel):
    input_text: str

class MooreInput(BaseModel):
    input_text: str

def parse_mealy_input(input_text: str):
    try:
        # Split the input text into lines and remove empty lines
        lines = [line.strip() for line in input_text.split('\n') if line.strip()]
        
        # Parse each line into transitions
        transitions = []
        for i, line in enumerate(lines):
            values = list(map(int, line.split()))
            if len(values) % 2 != 0:
                raise ValueError(f"Invalid number of values in line {i+1}")
            
            pairs = [(values[j], values[j+1]) for j in range(0, len(values), 2)]
            transitions.append(pairs)
        
        n = len(transitions)  # number of states
        m = len(transitions[0])  # number of inputs per state
        
        # Create transition and output tables
        t = [[pair[0] for pair in state_transitions] for state_transitions in transitions]
        s = [[pair[1] for pair in state_transitions] for state_transitions in transitions]
        
        return n, m, t, s
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input format: {str(e)}")

def convert_to_moore(n: int, m: int, t: List[List[int]], s: List[List[int]]):
    # Step 1: Split Mealy transitions into Moore states using qX/Y format
    state_map = {}
    moore_states = []
    suffix_count = {}

    for i in range(n):
        for j in range(m):
            next_state = t[i][j]
            output = s[i][j]
            key = (f"q{next_state}", output)
            if key not in state_map:
                base_name = f"q{next_state}"
                suffix_count[base_name] = suffix_count.get(base_name, -1) + 1
                suffix = "'" * suffix_count[base_name] if suffix_count[base_name] > 0 else ""
                state_name = f"{base_name}{suffix}/{output}"
                state_map[key] = state_name
                moore_states.append((state_name, next_state, output))

    # Sort Moore states
    def state_sort_key(item):
        name = item[0].split('/')[0].replace("q", "").replace("'", "")
        return int(name)

    moore_states.sort(key=state_sort_key)

    # Step 2: Build Moore transition table
    moore_transitions = {}
    for moore_state_name, orig_state_idx, out in moore_states:
        moore_transitions[moore_state_name] = []
        for inp in range(m):
            next_state = t[orig_state_idx][inp]
            next_out = s[orig_state_idx][inp]
            target_name = state_map[(f"q{next_state}", next_out)]
            moore_transitions[moore_state_name].append(target_name)

    return {
        "moore_states": [{"name": state[0], "output": state[2]} for state in moore_states],
        "transitions": moore_transitions,
        "inputs_per_state": m
    }

@app.post("/mealy-to-moore")
async def convert_mealy_to_moore(input_data: MealyInput):
    # Parse the input
    n, m, t, s = parse_mealy_input(input_data.input_text)
    
    # Create the original Mealy machine representation
    mealy_machine = {
        "states": [f"q{i}" for i in range(n)],
        "transitions": [
            {
                "from": f"q{i}",
                "input": str(j),
                "to": f"q{t[i][j]}",
                "output": str(s[i][j])
            }
            for i in range(n)
            for j in range(m)
        ]
    }
    
    # Convert to Moore machine
    moore_machine = convert_to_moore(n, m, t, s)
    
    return {
        "original": mealy_machine,
        "converted": moore_machine
    }

@app.post("/moore-to-mealy")
async def convert_moore_to_mealy(input_data: MooreInput):
    try:
        # Parse the input
        n, m, transitions, outputs = parse_moore_input(input_data.input_text)
        
        # Create the original Moore machine representation
        moore_machine = {
            "states": [{"name": f"q{i}", "output": outputs[i]} for i in range(n)],
            "transitions": {
                f"q{i}": [f"q{transitions[i][j]}" for j in range(m)]
                for i in range(n)
            },
            "inputs_per_state": m
        }
        
        # Convert to Mealy machine
        mealy_machine = convert_to_mealy(n, m, transitions, outputs)
        
        return {
            "original": moore_machine,
            "converted": mealy_machine
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Keep this for local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)