# Time-Locked Puzzle Chain

## Overview
A blockchain-based puzzle system that implements sequential, time-locked challenges where each solution reveals the key to the next puzzle.

## Features
- Time-locked puzzle release mechanism
- Sequential puzzle chain with cryptographic links
- Solution verification using SHA-256
- Individual solver tracking
- Owner-controlled puzzle creation

## Smart Contract Functions

### Administrative Functions
```clarity
(create-puzzle (question string-ascii) (hashed-solution buff) (unlock-height uint) (next-key buff))
```
Creates a new puzzle with specified parameters.
- Requires owner authorization
- Sets unlock time via block height
- Links to next puzzle via encrypted key

### User Functions
```clarity
(solve-puzzle (puzzle-id uint) (solution buff))
```
Submit a solution attempt for a puzzle.
- Verifies time lock has expired
- Validates solution hash
- Returns next puzzle key on success

### Read-Only Functions
- `get-puzzle-info`: Retrieve puzzle details
- `is-puzzle-solved`: Check solution status
- `get-current-puzzle-id`: Get latest puzzle ID

## Error Codes
- `err-not-found (u404)`: Puzzle doesn't exist
- `err-unauthorized (u403)`: Permission denied
- `err-puzzle-locked (u401)`: Time lock active
- `err-incorrect-solution (u400)`: Invalid solution

## Data Structures

### Puzzle Map
```clarity
{
  question: (string-ascii 256),
  hashed-solution: (buff 32),
  unlock-height: uint,
  next-key: (buff 32)
}
```

## Security Features
- Time-based access control
- Cryptographic solution verification
- Owner-only puzzle creation
- Immutable puzzle chain

## Usage Example
```clarity
;; Create new puzzle
(contract-call? .puzzle-chain create-puzzle 
  "What has keys but no locks?" 
  0x... ;; hashed solution
  (+ block-height u100) 
  0x... ;; next key
)

;; Submit solution
(contract-call? .puzzle-chain solve-puzzle u1 0x...)
```

## Requirements
- Stacks blockchain
- SHA-256 support
- Block height access

## Future Enhancements
- Difficulty progression
- Reward mechanism
- Time-based hints
- Social features

## Testing
- Unit test suite included
- Integration tests
- Mock chain testing

## License
[Insert License]

## Contributing
[Insert Contribution Guidelines]
