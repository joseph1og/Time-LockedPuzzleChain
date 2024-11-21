;; Time-Locked Puzzle Chain

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u404))
(define-constant err-unauthorized (err u403))
(define-constant err-puzzle-locked (err u401))
(define-constant err-incorrect-solution (err u400))

;; Data variables
(define-data-var current-puzzle-id uint u0)

;; Maps
(define-map puzzles uint {
  question: (string-ascii 256),
  hashed-solution: (buff 32),
  unlock-height: uint,
  next-key: (buff 32)
})

(define-map solved-puzzles {puzzle-id: uint, solver: principal} bool)

;; Public functions

;; Create a new puzzle
(define-public (create-puzzle (question (string-ascii 256)) (hashed-solution (buff 32)) (unlock-height uint) (next-key (buff 32)))
  (let
    (
      (puzzle-id (+ (var-get current-puzzle-id) u1))
    )
    (asserts! (is-eq tx-sender contract-owner) err-unauthorized)
    (map-set puzzles puzzle-id {
      question: question,
      hashed-solution: hashed-solution,
      unlock-height: unlock-height,
      next-key: next-key
    })
    (var-set current-puzzle-id puzzle-id)
    (ok puzzle-id)
  )
)

;; Attempt to solve a puzzle
(define-public (solve-puzzle (puzzle-id uint) (solution (buff 32)))
  (let
    (
      (puzzle (unwrap! (map-get? puzzles puzzle-id) err-not-found))
    )
    (asserts! (>= block-height (get unlock-height puzzle)) err-puzzle-locked)
    (asserts! (is-eq (sha256 solution) (get hashed-solution puzzle)) err-incorrect-solution)
    (map-set solved-puzzles {puzzle-id: puzzle-id, solver: tx-sender} true)
    (ok (get next-key puzzle))
  )
)

;; Read-only functions

(define-read-only (get-puzzle-info (puzzle-id uint))
  (map-get? puzzles puzzle-id))

(define-read-only (is-puzzle-solved (puzzle-id uint) (solver principal))
  (default-to false (map-get? solved-puzzles {puzzle-id: puzzle-id, solver: solver})))

(define-read-only (get-current-puzzle-id)
  (var-get current-puzzle-id))

