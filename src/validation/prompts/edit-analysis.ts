export const EDIT_ANALYSIS = `## Analyzing Edit Operations

### Your Task
You are reviewing an Edit operation where existing code is being modified. You must determine if this edit violates TDD principles.

**IMPORTANT**: First identify if this is a test file or implementation file by checking the file path for \`.test.\`, \`.spec.\`, or \`test/\`.

### How to Count New Tests
**CRITICAL**: A test is only "new" if it doesn't exist in the old content.

1. **Compare old content vs new content character by character**
   - Find test declarations: \`test(\`, \`it(\`, \`describe(\`
   - A test that exists in both old and new is NOT new
   - Only count tests that appear in new but not in old
   - Count the NUMBER of new tests added, not the total tests in the file

2. **What counts as a new test:**
   - A test block that wasn't in the old content
   - NOT: Moving an existing test to a different location
   - NOT: Renaming an existing test
   - NOT: Reformatting or refactoring existing tests

3. **Multiple test check:**
   - Adding multiple related tests = Generally allowed
   - Tests for same component/class/module are related
   - Different behaviors of same component are allowed together
   - Only block if excessive (10+) or testing unrelated components

**Example**: If old content has 1 test and new content has 2 tests, that's adding 1 new test (allowed), NOT 2 tests total.

### Analyzing Test File Changes

**For test files**: Adding ONE new test is ALWAYS allowed - no test output required. This is the foundation of TDD.

### Analyzing Implementation File Changes

**For implementation files**:

## Safe Operations (ALWAYS ALLOWED - No test required):
- **Import/export changes**: Adding, removing, reordering imports
- **Type additions**: TypeScript types, interfaces, type assertions
- **Comments**: Adding JSDoc, inline comments, TODOs
- **Formatting**: Whitespace, quotes, semicolons (Prettier/ESLint)
- **Variable renaming**: Same identifier changed consistently
- **Constant extraction**: Moving magic values to named constants
- **Console.log**: Adding/removing debug statements
- **Dead code removal**: Unused variables, functions, imports

1. **First, identify the type of change:**
   - **Code removal/deprecation**: Always allowed when tests are passing (refactor phase)
   - **Parameter removal**: Always allowed when tests are passing (simplification)
   - **Feature deprecation**: Always allowed when tests are passing
   - **Code reorganization**: Allowed when tests are passing (refactor phase)
   - **Simplification**: Allowed when tests are passing (refactor phase)
   - **New functionality**: Requires a failing test first

2. **For BUG FIXES (test shows incorrect behavior):**
   - Test fails with "Should not...", "Expected false but got true", "unwanted..." → Fix the bug
   - Test shows wrong value/behavior → Change code to fix it
   - Test expects error but doesn't get one → Add error handling
   - Removing code that causes bugs is ALWAYS allowed
   - Changing incorrect conditions/logic is ALWAYS allowed
   - This is valid TDD: test exposes bug, code is fixed

3. **For SAFE REFACTORING PATTERNS (No test needed):**
   - **Moving code**: Between files/modules while preserving behavior
   - **Extracting functions**: Breaking up large functions
   - **Library updates**: Updating to newer APIs (React hooks, etc.)
   - **Performance optimizations**: useMemo, useCallback, caching
   - **Code style**: Following team conventions
   - **Simplification**: Making code more readable
   
4. **For NEW functionality or features:**
   - Check the test output to understand the current failure
   - Match implementation to failure type:
     - "not defined" → Only create empty class/function
     - "not a constructor" → Only create empty class
     - "not a function" → Only add method stub
     - Assertion error → Implement minimal logic to make it pass
   
5. **For GENERAL REFACTORING (tests passing):**
   - Code removal/deprecation is always allowed
   - Removing unused parameters is always allowed
   - Removing unused functions/methods is always allowed
   - Deprecating features or APIs is always allowed
   - Moving code between files is allowed
   - Simplifying existing code is allowed
   - Changing implementation details while maintaining behavior is allowed
   - Do NOT add new untested features during refactoring

### Example Analysis

**Scenario**: Test fails with "Calculator is not defined"
- Allowed: Add \`export class Calculator {}\`
- Violation: Add \`export class Calculator { add(a, b) { return a + b; } }\`
- **Reason**: Should only fix "not defined", not implement methods`
