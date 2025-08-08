# TDD Guard - Balanced Approach

## Overview

TDD Guard now uses a **balanced approach** that maintains TDD discipline for new features while allowing common development patterns that don't require tests.

## Philosophy

- ✅ **Enforce test-first for NEW features** - Core TDD principle
- ✅ **Allow safe refactoring** - Code improvements without test changes
- ✅ **Permit bug fixes** - Driven by failing tests showing bugs
- ✅ **Enable maintenance work** - Cleanup and optimization

## Always Allowed (No Test Required)

### 1. Safe Refactoring Patterns

- **Variable/function renaming** - Consistent across files
- **Import reorganization** - Adding, removing, reordering
- **Code movement** - Between files while preserving behavior
- **Extracting functions** - Breaking up large functions
- **Extracting constants** - Moving magic values to named constants

### 2. Type Safety Improvements

- **TypeScript types/interfaces** - Adding type definitions
- **Type assertions** - Improving type safety
- **JSDoc comments** - Documentation in code
- **Type-only imports** - Type organization

### 3. Code Quality

- **Formatting** - Prettier/ESLint fixes
- **Comments** - Adding documentation
- **Console.log** - Debug statements
- **Dead code removal** - Unused variables/functions/imports

### 4. Bug Fixes

Test patterns that indicate bugs:

- "Should not..." - Unwanted behavior exists
- "Expected false but got true" - Wrong boolean
- "Found unwanted..." - Something shouldn't exist
- Wrong values/conditions that need fixing

### 5. Maintenance Work

- **Library updates** - Migrating to newer APIs
- **Performance optimizations** - useMemo, caching, etc.
- **Deprecated API updates** - Modernizing code
- **Configuration files** - Always allowed

### 6. Special Files (Always Allowed)

- `package.json`, `requirements.txt` - Dependencies
- `tsconfig.json`, `webpack.config.js` - Build configs
- `.env`, `.env.example` - Environment configs
- `.github/workflows/*` - CI/CD files
- `.gitignore`, `.gitattributes` - Git files
- `*.d.ts` - Type definitions
- Index/barrel exports - Module organization

## What Still Requires Tests

### ❌ NEW Features/Functionality

- New methods/functions
- New classes/components
- New business logic
- New API endpoints
- New user-facing features

### ❌ Behavioral Changes

- Changing what a function returns
- Adding new parameters (not removing)
- New conditional logic
- New error handling (unless fixing bugs)

## Examples

### ✅ Allowed Without Test

```javascript
// Renaming for clarity
- getUserData()
+ fetchUserProfile()

// Adding types
+ interface UserProps {
+   name: string;
+   email: string;
+ }

// Removing dead code
- function unusedHelper() { ... }

// Import reorganization
+ import { a, b, c } from './utils';
- import { b } from './utils';
- import { a } from './utils';
- import { c } from './utils';

// Performance optimization
- items.map(item => <Item key={item.id} item={item} />)
+ items.map(item => <Item key={item.id} {...item} />)

// Bug fix (test shows "Should not create file")
- fs.writeFileSync('unwanted.txt', data);
```

### ❌ Blocked - Needs Test First

```javascript
// New feature
+ function calculateDiscount(price, percentage) {
+   return price * (1 - percentage / 100);
+ }

// New behavior
function process(data) {
  // Adding new validation
+ if (!data.isValid) {
+   throw new Error('Invalid data');
+ }
  return data;
}

// New method on class
class User {
+ async updateProfile(data) {
+   await api.put('/profile', data);
+ }
}
```

## Summary

The balanced approach recognizes that not all code changes are "new features". It allows developers to:

- Refactor and improve code quality
- Fix bugs shown by tests
- Update and modernize code
- Optimize performance
- Improve type safety

While still enforcing test-first development for genuinely new functionality.

This approach reduces friction while maintaining the core benefits of TDD.
