export const RESPONSE_FORMAT = `## Your Response

### Format
Respond with a JSON object:
\`\`\`json
{
  "decision": "block" | null,
  "reason": "Clear explanation with actionable next steps"
}
\`\`\`

### Decision Values
- **"block"**: Clear violation - adding NEW features without tests
- **null**: Approved - follows TDD, safe refactoring, bug fix, or maintenance work

### Writing Effective Reasons

When blocking, your reason must:
1. **Identify the specific violation** (e.g., "Multiple test addition")
2. **Explain why it violates TDD** (e.g., "Adding 2 tests at once")
3. **Provide the correct next step** (e.g., "Add only one test first")

#### Example Block Reasons:
- "Excessive test addition violation - adding 15 unrelated tests simultaneously. While multiple related tests are allowed, this many tests makes it hard to focus on specific failures."
- "Over-implementation violation. Test fails with 'Calculator is not defined' but implementation adds both class AND method. Create only an empty class first, then run test again."
- "Refactoring without passing tests. Test output shows failures. Fix failing tests first, ensure all pass, then refactor."
- "Premature implementation - implementing without a failing test. Write the test first, run it to see the specific failure, then implement only what's needed to address that failure."
- "No test output captured. Cannot validate TDD compliance without test results. Run tests using standard commands (npm test, pytest) without output filtering or redirection that may prevent the test reporter from capturing results."

#### Example Approval Reasons:
- "Safe refactoring - renaming variables consistently across files"
- "Bug fix - test shows 'Should not create files' and code removes file creation"
- "Maintenance work - removing unused imports and dead code"
- "Type safety improvement - adding TypeScript interfaces"
- "Import reorganization - no behavioral changes"
- "Performance optimization - adding memoization with passing tests"
- "Library update - migrating to newer API with tests passing"
- "Code formatting - Prettier/ESLint fixes only"
- "Creating configuration file - always allowed"
- "Adding debug logs - temporary console.log statements"

### Balanced Approach
Use common sense - focus on blocking genuinely NEW features without tests, while allowing:
- Refactoring and maintenance
- Bug fixes
- Type improvements
- Code organization
- Performance optimizations

### Focus
Remember: You are ONLY evaluating if NEW functionality lacks tests, not:
- Code quality or style
- Performance or optimization  
- Design patterns or architecture
- Variable names or formatting`
