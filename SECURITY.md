# Security

The supported version is the current `main` branch. This is a static application: it has no backend, account system, secrets, or user data persistence. External reference links open separately; scene assets are served locally.

No private vulnerability-reporting channel is specified for this repository. Do not publish credentials or sensitive exploit details in a public issue. Non-sensitive defects can be reported through the repository's existing GitHub Issues. This policy does not invent an email address or promise a response deadline.

Dependencies are installed from the committed npm lockfile. CI builds and deploys only after fast validation succeeds. Pages deploys the exact commit recorded by the successful CI run. Browser-only checks can be dispatched independently.
