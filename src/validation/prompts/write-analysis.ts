export const WRITE_ANALYSIS = `## Analyzing Write Operations

### Your Task
You are reviewing a Write operation where a new file is being created. Determine if this violates TDD principles.

**FIRST**: Check the file path to identify if this is a test file (\`.test.\`, \`.spec.\`, or \`test/\`) or implementation file.

### Write Operation Rules

## Always Allowed Files (No test required):
- Configuration files (tsconfig, webpack, babel, etc.)
- Package files (package.json, requirements.txt, etc.)
- Environment files (.env, .env.example)
- CI/CD files (.github/workflows, .gitlab-ci.yml)
- Git files (.gitignore, .gitattributes)
- Documentation files (if not in ignore patterns)
- Type definition files (.d.ts)
- Index/barrel export files

1. **Creating a test file:**
   - Usually the first step in TDD (Red phase)
   - Multiple tests are ALLOWED when creating a new test file
   - Tests for the same component/class/module are considered related
   - Different behaviors of the same component (connect, disconnect, send) are ALLOWED together
   - Only block if excessive (10+) or testing completely different components
   - Test utilities and setup files are always allowed

2. **Creating an implementation file:**
   - Must have evidence of a failing test
   - Check test output for justification
   - Implementation must match test failure type
   - No test output = Likely violation

3. **Special considerations:**
   - Configuration files: Always allowed
   - Test helpers/utilities: Always allowed
   - Mock/fixture files: Always allowed
   - Empty stubs: Allowed if addressing test failure
   - Migration files: Always allowed
   - Generated code: Always allowed

### Common Write Scenarios

**Scenario 1**: Writing first test file
- Allowed: File with multiple related tests
- Allowed: Tests for different behaviors of same component
- Allowed: Connection/disconnection/send for same client
- Allowed: CRUD operations for same model
- Violation: Tests for completely different components
- Violation: Excessive tests (10+)
- Reason: Initial test setup benefits from comprehensive coverage

**Scenario 2**: Writing implementation without test
- Check for test output
- No output = "Premature implementation"
- With output = Verify it matches implementation

**Scenario 3**: Writing full implementation
- Test shows "not defined"
- Writing complete class with methods = Violation
- Should write minimal stub first

### Key Questions for Write Operations

1. Is this creating a test or implementation file?
2. If test: Are the tests related and reasonable in number (<10)?
3. If implementation: Is there a failing test?
4. Does the implementation match the test failure?
`
