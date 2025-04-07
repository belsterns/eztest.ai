import { CreatePullRequestDto } from './CreatePullRequestDto';

describe('CreatePullRequestDto', () => {
  it('should create an instance with valid properties', () => {
    const dto = new CreatePullRequestDto('title', 'body', 'head', 'base');
    expect(dto.title).toBe('title');
    expect(dto.body).toBe('body');
    expect(dto.head).toBe('head');
    expect(dto.base).toBe('base');
  });

  it('should throw an error if title is missing', () => {
    expect(() => new CreatePullRequestDto('', 'body', 'head', 'base')).toThrowError('Title is required');
  });

  it('should throw an error if body is missing', () => {
    expect(() => new CreatePullRequestDto('title', '', 'head', 'base')).toThrowError('Body is required');
  });
});