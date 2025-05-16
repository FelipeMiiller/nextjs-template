module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // (opcional, mas recomendado para Next.js 13+)
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // (opcional) ignore transformações em node_modules exceto arquivos next
  transformIgnorePatterns: [
    "/node_modules/(?!next/).+\\.js$"
  ],
};