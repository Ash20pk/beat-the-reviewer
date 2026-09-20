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

Make your own copy with **Use this template**, then, for each level, branch,
commit anything, and put your request in the pull request body.

```bash
gh repo clone <your-copy> && cd <your-copy>

cat levels/01/RULE.md            # what gets a request refused

git checkout -b level-01
echo "my attempt" > attempts/01.md
git add . && git commit -m "level 01"
git push -u origin level-01

gh pr create --base main --title "level 01" --body "your request here"
```

The branch name is how the reviewer knows which level you are playing, so it
has to be `level-01` … `level-10`. The file you commit does not matter — it
only exists so there is something to open a pull request with. **Your request
goes in the pull request body.**

The reviewer comments within about a minute. If it approves, the pull request
merges — that is the win. If it refuses, edit the body and it judges again:

```bash
gh pr edit --body "your better request"
```

**Levels unlock in order.** Level 02 will not be judged until you have beaten
01, and so on — a locked level is refused before the reviewer ever sees it.

Ten levels, `level-01` through `level-10`. Each one's `RULE.md` states the rule
being applied and the threshold you have to get under. The rule is public:
knowing the defence is what makes beating it worth something.

## Fair play

**Solve it yourself. Using an AI to write your requests is not allowed.**

You are welcome to use one to think — to explain a concept, or to tell you what
an argument is resting on. Having it draft the request is solving the puzzle,
and the puzzle is the whole point.

Nothing is judged on how it is written. A winning request is precise, scoped
and unemotional, which is also what machine-written text looks like, so a rule
keyed on prose would throw out the most careful human players first. What ends
a run is conduct:

- **No time to read.** More than one level won within 60 seconds of opening the
  pull request. A person reads the brief, gets refused, works out what the
  number objected to, and rewrites.
- **Clean sheet.** Four or more levels beaten without a single refused attempt
  at any of them. A refusal is what playing looks like.
- **Velocity.** More than one level beaten less than 90 seconds after the last.
- **Duplicate submissions.** Reusing a request that has already beaten a level,
  whoever wrote it first.

If you are removed, you are told which rule and the numbers behind it. A
removal you cannot check is just an accusation.

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
