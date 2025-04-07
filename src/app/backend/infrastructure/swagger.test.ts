import { generateSwaggerDoc } from './swagger';

describe('generateSwaggerDoc', () => {
  it('should return a valid Swagger document', () => {
    const doc = generateSwaggerDoc();
    expect(doc).toHaveProperty('swagger');
    expect(doc).toHaveProperty('info');
    expect(doc.info).toHaveProperty('title');
    expect(doc.info).toHaveProperty('version');
  });
});