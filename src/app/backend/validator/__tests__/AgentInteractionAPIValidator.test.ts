import { AgentInteractionAPIValidator } from '../AgentInteractionAPIValidator';

describe('AgentInteractionAPIValidator', () => {
  it('should validate valid input', () => {
    const input = { /* valid input data */ };
    const result = AgentInteractionAPIValidator.validate(input);
    expect(result).toBe(true);
  });

  it('should invalidate invalid input', () => {
    const input = { /* invalid input data */ };
    const result = AgentInteractionAPIValidator.validate(input);
    expect(result).toBe(false);
  });

  it('should throw error for missing required fields', () => {
    const input = { /* missing required fields */ };
    expect(() => AgentInteractionAPIValidator.validate(input)).toThrow(Error);
  });
});