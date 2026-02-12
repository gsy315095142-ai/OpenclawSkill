# SKILL: Feishu Doc Best Practices (飞书文档最佳实践)

## 🚨 MANDATORY EXECUTION RULES (执行规则 - 必须遵守!)
1.  **Write/Verify Protocol**: Whenever you use `write`, `append`, `update_block`, or `delete_block`, you **MUST** immediately perform a `read` or `get_block` action to verify the change was successful and correct.
    *   **Reason**: API calls may return 200 OK but content might be malformed or missing. Verification is the only proof of work.
    *   **Failure to verify = FAILURE**.

## Description
Guidelines for reading, writing, and structuring Feishu documents.
Activate when user asks to edit, append, or create complex documents.

## 1. Content Structure (Markdown to Feishu)
- Feishu docs support a subset of Markdown.
- **Headers**: Use `# H1`, `## H2`, `### H3`.
- **Lists**: Use `- ` for bullets, `1. ` for ordered lists.
- **Tables**: Use standard Markdown table syntax.
- **Images**: Upload via `feishu_upload` first, then use the returned `image_key` in the doc.

## 2. Block Operations
- **Append**: Use for adding content to the end of the doc. efficient for logs/journals.
- **Update**: Use `update_block` for modifying specific paragraphs. Requires `block_id` from a previous `list_blocks` call.

## 3. Permission checks
- Always check if you have write access before attempting large edits.
- If `403 Forbidden`, ask user to grant permission.

## 4. Concurrency
- Avoid multiple agents writing to the same doc simultaneously.
- Use `append` for safe concurrent writes if possible.
