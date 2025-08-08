export const MULTI_EDIT_ANALYSIS = `## Analyzing MultiEdit Operations

### Your Task
You are reviewing a MultiEdit operation where multiple edits are being applied to the same file. Each edit must be evaluated for TDD compliance.

**FIRST**: Check the file path to identify if this is a test file (\`.test.\`, \`.spec.\`, or \`test/\`) or implementation file.

### How to Analyze Multiple Edits

1. **Process edits sequentially**
   - Each edit builds on the previous one
   - Track cumulative changes across all edits
   - Count total new tests across ALL edits

2. **Counting new tests across edits:**
   - Start with the original file content
   - Apply each edit in sequence
   - Count tests that appear in final result but not in original
   - Multiple related tests are generally allowed

3. **Common patterns to watch for:**
   - Multiple related tests: Allowed
   - Tests for different behaviors of same component: Allowed
   - Connection/disconnection/messaging for same integration: Allowed
   - Excessive unrelated tests (10+): Violation

### Test File Changes

**For test files**: Adding multiple related tests across edits is generally allowed - helps create comprehensive test coverage. Only block excessive (10+) or clearly unrelated tests.
   
### Implementation Changes in MultiEdit

## Safe Operations (ALWAYS ALLOWED across multiple edits):
- Import reorganization across edits
- Type definitions added progressively
- Consistent renaming across multiple locations
- Code formatting/style fixes
- Progressive dead code removal
- Moving code between files in steps

1. **Identify the type of changes:**
   - **Refactoring (tests passing)**: Code removal, parameter removal, deprecation, reorganization always allowed
   - **New functionality**: Each edit must be justified by a failing test
   
2. **For BUG FIXES (test shows incorrect behavior):**
   - Multiple edits fixing related bugs are allowed
   - Progressive fixes across edits are fine
   - Removing buggy code in steps is allowed
   - Changing multiple incorrect conditions is allowed

3. **For SAFE REFACTORING PATTERNS (No test needed):**
   - Mass renaming across multiple edits
   - Progressive code extraction/reorganization
   - Step-by-step library migration
   - Incremental performance improvements
   
4. **For NEW functionality:**
   - Check if test output supports the change
   - Verify incremental implementation
   - No edit should over-implement

5. **For GENERAL REFACTORING (tests passing):**
   - Multiple edits removing/deprecating code are always allowed
   - Removing parameters across multiple edits is always allowed
   - Deprecating features or APIs across edits is always allowed
   - Reorganizing code across multiple edits is allowed
   - Simplifying in multiple steps is allowed
   - Do NOT add new untested features

### Example MultiEdit Analysis

**Edit 1**: Adds empty Calculator class
- Test output: "Calculator is not defined"
- Analysis: Appropriate minimal fix

**Edit 2**: Adds both add() and subtract() methods
- Test output: "calculator.add is not a function"
- Analysis: VIOLATION - Should only add add() method

**Reason**: "Over-implementation in Edit 2. Test only requires add() method but edit adds both add() and subtract(). Implement only the method causing the test failure."`
