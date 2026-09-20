# Beat the Reviewer

**Ten things you need approved. A reviewer that has to be convinced.**

[beat-the-reviewer.vercel.app](https://beat-the-reviewer.vercel.app)

You are asking for production access at 02:40. For an exception to the change
freeze. For MFA off on a service account. Write the request well enough and the
pull request merges. Write it the way people actually write these — asserting
that it will be fine — and it does not.

The reviewer is not a chatbot reading a prompt. It scores your argument with a
probability, and it tells you the number:

```
## REFUSED ❌

**`unjustified-production-access`** — block

> unjustified-production-access: 0.930 at or above the block threshold 0.5

`0.930`
```

You needed under `0.5`. You got `0.93`. Now you know how far off you were,
which is the part a yes-or-no never tells you.

```
APPROVED   the pull request merges. you beat that level.
REFUSED    you get the number, and why. edit and try again.
```

No middle ground, and taking the reviewer offline does not count as a pass.

## Play

**[Use this template](https://github.com/Ash20pk/beat-the-reviewer/generate)**
to make your own copy. Make it **public** if you want to appear on the board.

```bash
gh repo clone <your-copy> && cd <your-copy>

cat levels/01/RULE.md          # what gets a request refused

git checkout -b level-01
echo "my attempt" > attempts/01.md
git add . && git commit -m "level 01"
git push -u origin level-01

gh pr create --base main --title "level 01" \
  --body "INC-4471: 2,118 subscriptions were left ..."
```

Three things that matter:

- **Your request goes in the pull request body.** The file you commit is never
  read; it only exists so there is something to open a pull request with.
- **The branch name is the level.** `level-01` … `level-10`, nothing else.
- **Levels unlock in order.** Level 02 is not judged until 01 is beaten, and a
  locked level is refused before the reviewer ever sees it.

Refused? Rewrite the body and it judges again:

```bash
gh pr edit --body "your better request"

# some versions of the gh CLI fail on pr edit; this always works:
gh api -X PATCH repos/<you>/<your-copy>/pulls/1 -f body="your better request"
```

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
| 09 | Unattended | an agent acting while nobody is there |
| 10 | The honest one | — |

Each level's `RULE.md` states the rule being applied and the threshold you have
to get under. The rule is public — knowing the defence is what makes beating it
worth something. What it never tells you is what *passes*.

What works on 01 through 03 is roughly what works on a real reviewer: a
specific scope, a bound that exists in code rather than in intention, a way
back, and someone named. Asserting confidence does not move the number.

Then 04, 05, 08 and 09 punish you for having learned that. Level 10 is
different again, and the only hint you get is that nine levels of practice at
making things sound acceptable is the wrong preparation for it.

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

Each level is a typed judgement rule: a deterministic gate, a question, and a
threshold. The question goes to `jev-1.13.0`, a pinned TypeSafe System One
model, which answers with a probability rather than a sentence. The threshold
turns that number into the verdict.

Pinned, not floating — the levels are tuned to thresholds as fine as `0.25`,
and a model that moved under them would silently retune the whole game.

Every comment carries the version that actually answered and a hash of the
question that was asked, so the reviewer cannot move the goalposts without that
hash changing.

There is no API key in this repository and nothing to configure. Judgement
happens on a hosted endpoint that holds the key; your copy only ever sends a
level number and what you wrote.

## The board

[beat-the-reviewer.vercel.app](https://beat-the-reviewer.vercel.app) shows who
has beaten what, and which levels nobody has taken yet.

Only public copies of this template appear. Every win is re-checked against
GitHub before it is recorded — the pull request has to exist, be merged, sit on
the branch it claims, and be yours.
