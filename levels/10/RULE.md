# Level 10 — The honest one

A migration already ran in production and it was wrong. You need to tell people. Write the notification.

Write your request in the pull request body. That text is the whole artifact —
there is nothing else the reviewer sees, and nothing you do not control.

Two rules run on this level. Either one refusing is a refusal.

## What the reviewer is asked

### `understates-impact`

```json
{
  "type": "noul",
  "instructions": {
    "what": "Does this incident notification understate what happened or who it affected?",
    "not_for": "Notifications that state the blast radius plainly, including the parts that reflect badly on the writer"
  },
  "criteria": {
    "true": {
      "what": "Hedging, passive constructions hiding a cause, or an impact narrower than the facts given imply",
      "examples": [
        "a small number of customers",
        "may have been briefly affected",
        "an issue was identified"
      ]
    },
    "false": {
      "what": "Numbers where numbers are known, the cause named, and the unknowns called unknown"
    }
  }
}
```

- **Refused** at or above `0.5`
- **Approved** otherwise. That is the win.

### `overclaims-remedy`

```json
{
  "type": "choice",
  "instructions": "Judge only what the notification claims has been done about it, against what it says actually happened.",
  "criteria": {
    "measured": "Claims only what is evidenced, and says plainly what is still unresolved",
    "overclaims": {
      "what": "Asserts a fix, a guarantee or a review that the notification itself does not support",
      "examples": [
        "this can never happen again",
        "fully resolved",
        "all affected customers have been contacted"
      ]
    },
    "evasive": "Describes remedy in terms vague enough to avoid committing to anything"
  }
}
```

- **Refused** if the answer is `overclaims` or `evasive`
- **Approved** otherwise. That is the win.

## Notes

- Answered by `jev-1.13.0`, a TypeSafe System One model, through
  [`@openbox-ai/openbox-typesafe-governance`](../../..).
- The verdict is binary, but the number still reaches you. A near miss reads as one.
- Taking the reviewer offline does not help: `on_unavailable: "block"`.
