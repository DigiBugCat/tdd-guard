export const TDD_CORE_PRINCIPLES = `## TDD Fundamentals

### Balanced TDD Approach
We use a **balanced** approach that maintains TDD discipline while allowing common development patterns:
- ✅ Enforces test-first for NEW features
- ✅ Allows safe refactoring without test changes
- ✅ Permits bug fixes driven by failing tests
- ✅ Enables maintenance and cleanup work

### The TDD Cycle
The foundation of TDD is the Red-Green-Refactor cycle:

1. **Red Phase**: Write failing tests that describe desired behavior
   - Tests must fail for the RIGHT reason (not syntax/import errors)
   - Multiple related tests are allowed, especially when creating new test files
   - **Adding tests to a test file is ALWAYS allowed** - no prior test output needed
   - Starting TDD for a new feature is always valid, even if test output shows unrelated work

2. **Green Phase**: Write MINIMAL code to make the test pass
   - Implement only what's needed for the current failing test
   - No anticipatory coding or extra features
   - Address the specific failure message

3. **Refactor Phase**: Improve code structure while keeping tests green
   - Only allowed when relevant tests are passing
   - Requires proof that tests have been run and are green
   - Applies to BOTH implementation and test code
   - **Allowed refactoring activities:**
     - Removing deprecated/unused code
     - Simplifying existing implementations
     - Reorganizing/moving code between files
     - Renaming for clarity
     - Extracting common patterns
     - Updating to newer APIs/patterns
   - **NOT allowed:** Adding new untested functionality
   - No refactoring with failing tests - fix them first

### Always Allowed (No Test Required)

These changes are ALWAYS permitted without failing tests:

1. **Code Quality**
   - Adding/updating comments and documentation
   - Formatting and style fixes (Prettier/ESLint)
   - Adding TypeScript types and interfaces
   
2. **Safe Refactoring**
   - Renaming variables/functions consistently
   - Reordering imports
   - Extracting constants
   - Moving code between files
   
3. **Maintenance**
   - Removing unused code/imports
   - Updating deprecated APIs
   - Adding/removing console.log statements
   - Performance optimizations (memoization, etc.)

4. **Bug Fixes**
   - When test shows "Should not..." or "Expected false..."
   - Fixing incorrect conditions or logic
   - Removing code causing unwanted behavior

### Core Violations

1. **Over-Implementation**  
   - Code that exceeds what's needed to pass the current failing test
   - Adding untested features, methods, or error handling
   - Implementing multiple methods when test only requires one

2. **Premature Implementation**
   - Adding NEW functionality before a test exists and fails properly
   - Adding NEW features without running the test first
   - Does NOT apply to: safe refactoring patterns, bug fixes, maintenance work
   - Does NOT apply to: code removal, deprecation, or simplification
   - Only applies to genuinely NEW features or behavior

3. **Multiple Test Addition (RELAXED)**
   - This is generally acceptable when:
     - Creating a new test file (Write operation)
     - Setting up a test suite structure
     - Testing different behaviors of the same component/class/module
     - Tests are scoped to a single area of concern
   - Examples of ALLOWED multiple tests:
     - Connection, disconnection, and messaging tests for a chat client
     - Add, subtract, multiply tests for a calculator
     - CRUD operations for the same model/entity
   - Only block if:
     - Adding excessive tests (10+) at once
     - Testing completely unrelated components in the same file

### Critical Principle: Incremental Development
Each step in TDD should address ONE specific issue:
- Test fails "not defined" → Create empty stub/class only
- Test fails "not a function" → Add method stub only  
- Test fails with assertion → Implement minimal logic only

### General Information
- Sometimes the test output shows as no tests have been run when a new test is failing due to a missing import or constructor. In such cases, allow the agent to create simple stubs. Ask them if they forgot to create a stub if they are stuck.
- It is never allowed to introduce new logic without evidence of relevant failing tests. However, stubs and simple implementation to make imports and test infrastructure work is fine.
- In the refactor phase, it is perfectly fine to refactor both teest and implementation code. That said, completely new functionality is not allowed. Types, clean up, abstractions, and helpers are allowed as long as they do not introduce new behavior.
- Adding types, interfaces, or a constant in order to replace magic values is perfectly fine during refactoring.
- Provide the agent with helpful directions so that they do not get stuck when blocking them.
`
