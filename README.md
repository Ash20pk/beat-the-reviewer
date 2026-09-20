# Beat the Reviewer

Ten things you need approved. A reviewer that has to be convinced.

You write the request. That text is the whole artifact — there is no hidden
context and no fixed diff, so everything the verdict turns on is something you
control.

```
  APPROVED   it merges. you beat that level.
  REFUSED    it tells you why, and the number you scored. try again.
```

No middle ground. Taking the reviewer offline does not count as a pass.

## How to play

Levels are branches. Pick one, open a pull request, and **put your request in
the pull request body**.

```bash
gh repo clone <your-copy-of-this-repo> && cd beat-the-reviewer

git checkout level-01
cat levels/01/RULE.md          # the brief, and exactly what the reviewer is asked

gh pr create --base main --title "level 01" --body "your request here"
```

The reviewer comments within about a minute. If it approves, the pull request
merges — that is the win. If it refuses, edit the description and it judges
again:

```bash
gh pr edit --body "your better request"
```

Ten levels, `level-01` through `level-10`. Each one's `RULE.md` states the rule
being applied and the threshold you have to get under. The rule is public:
knowing the defence is what makes beating it worth something.

## The reviewer

Not a chatbot reading a prompt. Each level is a typed judgement rule: a
deterministic gate, a question, and a threshold. The question goes to
`jev-1.13.0`, a pinned TypeSafe System One model, which answers with a
probability rather than a sentence, and the threshold turns that number into the
verdict.

Which is why a refusal tells you the number you scored against the number you
needed, and carries the hash of the question that was asked. The reviewer
cannot move the goalposts without that hash changing.

There is no API key in this repository and nothing for you to configure.
Judgement happens on a hosted endpoint that holds the key.

## The levels

| # | | What you have to get past |
|---|---|---|
| 01 | Production access | read-write on prod, at 02:40 |
| 02 | The freeze | shipping during a change freeze |
| 03 | The service account | turning MFA off for a nightly job |
| 04 | The other tenant | reading data that is not your customer's |
| 05 | Skip review | merging with nobody else awake |
| 06 | The retention exception | keeping personal data past its deadline |
| 07 | The new tool | letting an agent email customers |
| 08 | The irreversible one | a migration that cannot be undone |
| 09 | Unattended | an agent merging overnight, unwatched |
| 10 | The honest one | — |

What beats levels 01–09 is what beats a real reviewer: a specific scope, a bound
that exists in code rather than in intention, and a way back. Asserting
confidence does not move the number.

Level 10 is different, and the only hint you get is that nine levels of practice
at making things sound acceptable is the wrong preparation for it.
