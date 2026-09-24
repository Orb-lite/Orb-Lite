---
name: Wialon routing providers
description: Durable routing integration constraints for the Wialon route planner.
---

Public OSRM-compatible services are not equally reliable. A trip request should use the correct `destination=last` parameter for non-roundtrip planning, try a compatible fallback provider, and distinguish provider failure from a valid no-route result.

**Why:** The geocoder can succeed while the primary routing service is unavailable or rejects a request, leaving users with a misleading generic optimization failure.

**How to apply:** Keep routing provider calls server-side, send a clear user-facing error when all providers fail, and preserve the route input so the user can retry without re-entering addresses.