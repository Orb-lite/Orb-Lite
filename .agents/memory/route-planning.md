---
name: Route planning
description: External geocoding and road-network optimization constraints for the Wialon route creator.
---

The route planner geocodes user-entered addresses server-side, uses OSRM Trip to optimize the stop order, and samples long geometries before sending them to Wialon.

**Why:** Address geocoding and road-aware ordering need server-side calls, while Wialon route persistence has a practical point-count limit.

**How to apply:** Keep provider calls behind server functions, preserve the optional round trip flag, and cap/simplify returned geometry before saving.