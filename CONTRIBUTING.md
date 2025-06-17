# Contributing to vVv Crusade Tracker

Thank you for your interest in contributing to the vVv Crusade Tracker! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/vvv-crusade-tracker.git
   cd vvv-crusade-tracker
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/vvv-crusade-tracker.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Start development server:
   ```bash
   npm run dev  # For mock data mode
   npm run dev:prod  # For Supabase mode
   ```

## Making Changes

### Branch Naming

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
git checkout -b fix/your-bug-fix
git checkout -b docs/your-documentation-update
```

### Commit Messages

Follow the conventional commits specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```bash
git commit -m "feat: add workout history graph"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use meaningful variable and function names
- Add comments for complex logic

### React/JSX Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use prop-types or TypeScript for type checking
- Extract reusable logic into custom hooks
- Follow the existing file structure

## Submitting Changes

1. Update your branch with latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your changes:
   ```bash
   git push origin your-branch-name
   ```

3. Create a Pull Request:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Provide a clear title and description
   - Link any related issues
   - Wait for review and address feedback

### Pull Request Guidelines

Your PR should:
- Have a clear, descriptive title
- Include a detailed description of changes
- Reference any related issues
- Pass all CI checks
- Have no merge conflicts
- Include tests for new features
- Update documentation if needed

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features
- Update tests when modifying existing features
- Aim for high test coverage
- Use descriptive test names

Example test structure:
```javascript
describe('ProgressCard', () => {
  it('should display exercise name', () => {
    // Test implementation
  })

  it('should handle submit correctly', () => {
    // Test implementation
  })
})
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions:
  ```javascript
  /**
   * Calculates total reps for a workout
   * @param {Array} exercises - Array of exercise objects
   * @returns {number} Total rep count
   */
  function calculateTotalReps(exercises) {
    // Implementation
  }
  ```

- Document component props:
  ```javascript
  /**
   * Progress tracking card component
   * @param {Object} props
   * @param {string} props.exerciseType - Type of exercise
   * @param {Function} props.onSubmit - Callback for form submission
   */
  function ProgressCard({ exerciseType, onSubmit }) {
    // Component implementation
  }
  ```

### README Updates

Update the README.md when:
- Adding new features
- Changing setup procedures
- Modifying API endpoints
- Adding new dependencies

## Common Tasks

### Adding a New Feature

1. Create a feature branch
2. Implement the feature
3. Add tests
4. Update documentation
5. Submit PR

### Fixing a Bug

1. Create a bug fix branch
2. Write a failing test that reproduces the bug
3. Fix the bug
4. Ensure all tests pass
5. Submit PR

### Updating Dependencies

1. Check for outdated packages: `npm outdated`
2. Update package.json
3. Run `npm install`
4. Test thoroughly
5. Document any breaking changes

## Getting Help

- Check existing issues and PRs
- Ask questions in issues
- Join the vVv Gaming Discord
- Review the codebase for examples

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- The vVv Gaming community

Thank you for contributing to the vVv Crusade Tracker!