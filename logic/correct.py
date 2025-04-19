def print_mealy(n, m, t, s):
    print("\nMealy Machine")
    print("===============")
    print("State\t\t" + "\t\t".join([f"At_{i}\tOutput_{i}" for i in range(m)]))
    print("-" * (16 + m * 16))

    for i in range(n):
        print(f"q{i}\t\t", end="")
        for j in range(m):
            print(f"q{t[i][j]}\t\t{s[i][j]}\t\t", end="")
        print()
    print()

def main():
    # Get number of states and number of inputs per state
    n = int(input("Enter the number of states: "))
    m = int(input("Enter the number of inputs per state: "))

    # Initialize transition and output tables
    t = [[0] * m for _ in range(n)]
    s = [[0] * m for _ in range(n)]

    print("\nEnter the Mealy machine transitions (state output pairs):")
    print(f"Format for each state: nextState0 output0 ... nextState{m-1} output{m-1}")
    for i in range(n):
        row = list(map(int, input(f"State q{i}: ").split()))
        if len(row) != 2 * m:
            print("Invalid input! Please provide correct number of values.")
            return
        for j in range(m):
            t[i][j] = row[j * 2]
            s[i][j] = row[j * 2 + 1]

    print_mealy(n, m, t, s)

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

    # Sort Moore states to ensure q0-related states come first
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

    # Step 3: Print Moore table
    print("\nMoore Machine")
    print("===============")
    headers = " | ".join([f"On Input {i}" for i in range(m)])
    print(f"| State     | {headers} |")
    print("|" + "-" * (12 + 13 * m))

    for moore_state_name, _, _ in moore_states:
        transitions = moore_transitions[moore_state_name]
        row = " | ".join(f"{to:<11}" for to in transitions)
        print(f"| {moore_state_name:<9} | {row} |")

if __name__ == "__main__":
    main()