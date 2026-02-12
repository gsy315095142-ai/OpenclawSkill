# SKILL: OpenRouter Account Manager

## Description
Check OpenRouter account balance and credit limit.
Activate when user asks for "OpenRouter 账户" or "OpenRouter 余额".

## Configuration
- **API Key**: `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` (READ-ONLY used for balance checks)

## Usage
Run the following curl command to fetch credits:
`curl -s https://openrouter.ai/api/v1/credits -H "Authorization: Bearer <API_KEY>"`

Returns JSON:
```json
{
  "data": {
    "total_usage": 12.34,
    "total_credits": 50.00,
    "credits": 37.66
  }
}
```
Present the `credits` (remaining balance) to the user clearly.
