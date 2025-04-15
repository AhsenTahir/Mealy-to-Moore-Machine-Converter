"""
    Conversion of Mealy to Moore Machine
    ====================================
    Originally by armag-pro [https://github.com/armag-pro]
    Converted to Python
    Takes a Mealy machine transition matrix as input. Outputs both Mealy and Moore machine matrices.
"""

N = 109

def print_mealy(n, m, t, s):
    print("\nMealy Machine")
    print("===============")
    print("State\t\tAt_0\t\tOutput_0\tAt_1\t\tOutput_1")
    print("----------------------------------------------------------------")
    
    for i in range(n):
        print(f"q{i}\t\t", end="")
        # For input 0
        print(f"q{t[i][0]}\t\t{s[i][0]}\t\t", end="")
        # For input 1
        print(f"q{t[i][1]}\t\t{s[i][1]}")
    print()

def print_moore(n, m, t, s, oc, cnt):
    print("\nMoore Machine")
    print("===============")
    print("| State  | Output | On Input 0 | On Input 1 |")
    print("|--------|--------|------------|------------|")
    
    # For each state and possible output combination
    for i in range(n):
        for j in range(m):
            if oc[i][j]:
                # Print state with output and the output column
                print(f"| q{i}/{j}   |   {j}    |", end="")
                
                # Print transitions for input 0
                next_state_0 = t[i][0]
                next_output_0 = s[i][0]
                print(f"   q{next_state_0}/{next_output_0}     |", end="")
                
                # Print transitions for input 1
                next_state_1 = t[i][1]
                next_output_1 = s[i][1]
                print(f"   q{next_state_1}/{next_output_1}     |")
    print()

def main():
    # Set number of states and symbols
    n, m = 4, 2
    
    # Initialize transition and symbol matrices
    t = [[0] * m for _ in range(n)]
    s = [[0] * m for _ in range(n)]
    
    # Initialize occurrence tracking
    oc = [[False] * m for _ in range(n)]
    cnt = [0] * N
    
    print("Enter the Mealy machine transitions (state output pairs):")
    print("Format: next_state0 output0 next_state1 output1")
    print("Enter 4 numbers per line for each state:")
    
    # Input Mealy machine
    for i in range(n):
        row = list(map(int, input().split()))
        for j in range(m):
            t[i][j] = row[j*2]    # Even indices for transitions
            s[i][j] = row[j*2+1]  # Odd indices for symbols
    
    # First print the Mealy machine
    print_mealy(n, m, t, s)
    
    # Count the number of symbols which go to a particular state
    for i in range(n):
        for ii in range(n):
            for j in range(m):
                if t[ii][j] == i:
                    oc[i][s[i][j]] = True
    
    for i in range(n):
        cnt[i] = sum(1 for j in range(m) if oc[i][j])
    
    # Then print the Moore machine
    print_moore(n, m, t, s, oc, cnt)

if __name__ == "__main__":
    main()
