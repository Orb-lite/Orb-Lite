---
name: Wialon permission semantics
description: Non-obvious Wialon permission rules for CMS creation flows.
---

Wialon separates the user's `Can create objects` flag, the administrator role, and the account services that enable unit/user creation. A permission check must consider all three instead of treating one missing flag or service response as a complete denial.

**Why:** The parent account can be an administrator while the user-level creation flag or account service response is represented differently across Wialon interfaces and API variants.

**How to apply:** Resolve the user's billing account, read account data through the account API with a compatible fallback, recognize the administrator role, and only deny a specific creation type when its service is explicitly disabled. Let Wialon remain the final authority when the create operation is attempted.