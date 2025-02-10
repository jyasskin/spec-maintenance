# Web Specification Maintenance
## 🌏  Open in the Cloud 
Click any of the buttons below to start a new development environment to demo or contribute to the codebase without having to install anything on your machine:

[![Open in VS Code](https://img.shields.io/badge/Open%20in-VS%20Code-blue?logo=visualstudiocode)](https://vscode.dev/github/speced/spec-maintenance)
[![Open in Glitch](https://img.shields.io/badge/Open%20in-Glitch-blue?logo=glitch)](https://glitch.com/edit/#!/import/github/speced/spec-maintenance)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/speced/spec-maintenance?quickstart=1)[![Edit in Codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/speced/spec-maintenance)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/speced/spec-maintenance)
[![Open in Repl.it](https://replit.com/badge/github/withastro/astro)](https://replit.com/github/speced/spec-maintenance)
[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/speced/spec-maintenance)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/speced/spec-maintenance)

This repository holds a [tool](https://speced.github.io/spec-maintenance/) for tracking the maintenance of web specifications. To get started quickly:

1. Click the Codespaces button above.
1. Wait for the codespace to finish initializing.
1. Run `pnpm dev` in the codespace's terminal.
1. When VSCode reports that "Your application running on port 4321 is available", click the "Open in
   Browser" button to see the server.

## Research that motivated the design

The current tool behavior is documented in an [About
page](https://speced.github.io/spec-maintenance/about).

### Triage

All new issues (and PRs) need to get a priority assigned within a reasonable amount of time. To
determine that amount of time, I looked at the distribution of the times it took issues to get their
first comment or review from someone other than the issue's author.

| | Issues that are<br>still open | Issues that have<br>been closed | Overall
---: | --- | --- | ---
10th percentile | 21 minutes | 7 minutes | 8 minutes
25th percentile | 2 hours    | 43 minutes | 50 minutes
median          | 16 hours   | 8 hours    | 9 hours
mean            | 2.1 months | 3.3 weeks  | 1 month
75th percentile | 1.3 weeks  | 3 days    | 3 days
90th percentile | 4.3 months | 3.3 weeks | 1 month

I propose we set an SLO of 1 week to triage issues. If all issues took as long to triage as they do
to comment on, this would leave 26% of the 16731 open issues currently out of SLO. 20% of the 94591
issues we've ever had have violated this SLO.

### Priorities

I propose we define 3 priority levels, with labels `Priority: Urgent`, `Priority: Soon`, and
`Priority: Eventually`. `Priority: Eventually` issues won't have an SLO. For the others, we can look
at the latency distribution for closing issues. Still-open issues tend to be much older than closed
issues, and I assume they'd mostly be labeled with `Priority: Eventually`.

| | Time to close
---: | ---
10th percentile | 1 hour
25th percentile | 17 hours
median          | 1.1 weeks
mean            | 3.7 months
75th percentile | 2.3 months
90th percentile | 11.1 months

With half of all closed issues being closed in about a week, we can probably set a `Priority:
Urgent` SLO of 1 week more than the triage SLO, so 2 weeks.

If we set a `Priority: Soon` SLO of 3 months, we'll catch over half of the remaining issues, so
that's what I suggest.
