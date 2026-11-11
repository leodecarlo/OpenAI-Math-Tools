---
name: sol-pro-cost-reporting
description: "Use whenever Sol-Pro makes a GPT-6.1 Sol API call, so its cost is shown in the chat."
---

# Report Sol-Pro call cost

After `sol_pro_start` or `sol_pro_continue`, use `sol_pro_get` as needed until that response reaches a final status. Report the response ID, final status, and `pricing.estimated_model_usd` in the chat. Label the amount **estimated model cost (USD)**. If that field is null or missing, say that the estimate is unavailable.

For a chain with continuations, report the estimate for each distinct response ID and the sum of available estimates. Count each response only once; repeated `sol_pro_get` checks are not additional model calls. If any estimate is unavailable, label the sum as partial.

The estimate covers model tokens only. State that tool and container charges are excluded and that the OpenAI Platform billing record is authoritative for the final charge. Do not present the estimate or partial sum as the complete bill.
