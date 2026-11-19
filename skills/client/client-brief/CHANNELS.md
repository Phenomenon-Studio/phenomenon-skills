# Channel formats

## Message (email / doc) — markdown

- Greeting, one-paragraph summary with counts ("41 points reviewed: 30 scheduled, 11 not valid, 8 need your decision").
- Invalid points as a table: `# · Claim · What we found`. One sentence per cell.
- "Decisions we need from you" — numbered, from `decision-request`.
- "Priority changes" — short paragraphs.
- Sign-off. Under ~1 screen per section.

## Slack — mrkdwn

- One message per point, plus an intro message; separate with `---` in the file and a `## N. <id> — <title>` heading the user copies past.
- Slack syntax: `*bold*`, `_italic_`, `` `code` ``, `>` quote. Markdown headings, tables and `**bold**` render as plain text in Slack.
- Italic labels: `_Claim:_ … _Finding:_ … _Evidence:_ … _Conclusion:_ … _Question:_ …`.
- Each message stands alone: repeat the point ID and title in its first line.

## Ticket comment (Jira / Linear / GitHub / Bitbucket)

- One comment per point, written to sit under that ticket.
- First line = verdict ("Not valid — the checklist is already in place.").
- Then Finding, Evidence, Next step. Technical detail allowed when the ticket audience is engineering (paths, commit hashes, commands).

## Technical appendix (optional)

For a client engineer or contractor: per point the file:line, commit, command run and its output. Keeps the main message plain while the proof stays reachable.
