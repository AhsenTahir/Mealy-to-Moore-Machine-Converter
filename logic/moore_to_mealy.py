def parse_moore_input(input_text: str):
    """
    Parse Moore machine input format.
    Input format: First line contains outputs for each state
    Subsequent lines contain transition table
    """
    try:
        # Split the input text into lines and remove empty lines
        lines = [line.strip() for line in input_text.split('\n') if line.strip()]
        
        # First line contains outputs
        outputs = list(map(int, lines[0].split()))
        
        # Parse transition table
        transitions = []
        for line in lines[1:]:
            transitions.append(list(map(int, line.split())))
        
        n = len(outputs)  # number of states
        if len(transitions) != n:
            raise ValueError("Number of transitions must match number of states")
        
        m = len(transitions[0]) if transitions else 0  # number of inputs per state
        
        return n, m, transitions, outputs
    except Exception as e:
        raise ValueError(f"Invalid input format: {str(e)}")

def convert_to_mealy(n: int, m: int, transitions: list, outputs: list):
    """
    Convert Moore machine to Mealy machine.
    
    Args:
        n: number of states
        m: number of inputs per state
        transitions: transition table where transitions[i][j] represents next state
                    from state i on input j
        outputs: list of outputs where outputs[i] is the output for state i
    
    Returns:
        Dictionary containing Mealy machine representation
    """
    # Create Mealy transition and output tables
    mealy_transitions = []
    mealy_outputs = []
    
    # For each state
    for i in range(n):
        state_transitions = []
        state_outputs = []
        # For each input
        for j in range(m):
            next_state = transitions[i][j]
            # In Mealy machine, output is associated with the destination state
            output = outputs[next_state]
            state_transitions.append(next_state)
            state_outputs.append(output)
        mealy_transitions.append(state_transitions)
        mealy_outputs.append(state_outputs)
    
    # Create the Mealy machine representation
    mealy_machine = {
        "states": [f"q{i}" for i in range(n)],
        "transitions": [
            {
                "from": f"q{i}",
                "input": str(j),
                "to": f"q{mealy_transitions[i][j]}",
                "output": str(mealy_outputs[i][j])
            }
            for i in range(n)
            for j in range(m)
        ]
    }
    
    return mealy_machine 