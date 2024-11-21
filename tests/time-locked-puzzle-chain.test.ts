import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/time-locked-puzzle-chain.clar', 'utf8')

describe('Time-Locked Puzzle Chain Contract', () => {
  it('should define contract-owner constant', () => {
    expect(contractSource).toContain('(define-constant contract-owner tx-sender)')
  })
  
  it('should define error constants', () => {
    expect(contractSource).toContain('(define-constant err-not-found (err u404))')
    expect(contractSource).toContain('(define-constant err-unauthorized (err u403))')
    expect(contractSource).toContain('(define-constant err-puzzle-locked (err u401))')
    expect(contractSource).toContain('(define-constant err-incorrect-solution (err u400))')
  })
  
  it('should define current-puzzle-id data variable', () => {
    expect(contractSource).toContain('(define-data-var current-puzzle-id uint u0)')
  })
  
  it('should define puzzles map', () => {
    expect(contractSource).toContain('(define-map puzzles uint {')
    expect(contractSource).toContain('question: (string-ascii 256),')
    expect(contractSource).toContain('hashed-solution: (buff 32),')
    expect(contractSource).toContain('unlock-height: uint,')
    expect(contractSource).toContain('next-key: (buff 32)')
  })
  
  it('should define solved-puzzles map', () => {
    expect(contractSource).toContain('(define-map solved-puzzles {puzzle-id: uint, solver: principal} bool)')
  })
  
  it('should have a create-puzzle function', () => {
    expect(contractSource).toContain('(define-public (create-puzzle (question (string-ascii 256)) (hashed-solution (buff 32)) (unlock-height uint) (next-key (buff 32)))')
  })
  
  it('should check for contract owner in create-puzzle function', () => {
    expect(contractSource).toContain('(asserts! (is-eq tx-sender contract-owner) err-unauthorized)')
  })
  
  it('should have a solve-puzzle function', () => {
    expect(contractSource).toContain('(define-public (solve-puzzle (puzzle-id uint) (solution (buff 32)))')
  })
  
  it('should check for puzzle unlock time in solve-puzzle function', () => {
    expect(contractSource).toContain('(asserts! (>= block-height (get unlock-height puzzle)) err-puzzle-locked)')
  })
  
  it('should check for correct solution in solve-puzzle function', () => {
    expect(contractSource).toContain('(asserts! (is-eq (sha256 solution) (get hashed-solution puzzle)) err-incorrect-solution)')
  })
  
  it('should have a get-puzzle-info read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-puzzle-info (puzzle-id uint))')
  })
  
  it('should have an is-puzzle-solved read-only function', () => {
    expect(contractSource).toContain('(define-read-only (is-puzzle-solved (puzzle-id uint) (solver principal))')
  })
  
  it('should have a get-current-puzzle-id read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-current-puzzle-id)')
  })
})

