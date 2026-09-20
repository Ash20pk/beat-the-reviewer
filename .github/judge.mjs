/**
 * Posts the reviewer's verdict on a pull request, and merges it on a win.
 *
 * Holds no key and reaches no model. It sends the level number and what the
 * player wrote to the hosted judge, which holds the rules — so editing a
 * threshold in this repository does not move the one that decides.
 *
 * Node 20, no dependencies: fetch is built in and the GitHub REST API is three
 * calls.
 */
const {
  PR_TITLE = '',
  PR_BODY = '',
  PR_NUMBER,
  PR_BRANCH = '',
  PLAYER = 'anonymous',
  REPO,
  GITHUB_TOKEN,
  JUDGE_URL,
} = process.env;

/** Levels are branches: level-03 plays level 03. */
const level = /^level-(\d{2})$/.exec(PR_BRANCH.trim())?.[1];

const api = async (path, init = {}) => {
  const response = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`${init.method ?? 'GET'} ${path} -> ${response.status} ${await response.text()}`);
  }
  return response.status === 204 ? null : response.json();
};

const comment = (body) =>
  api(`/issues/${PR_NUMBER}/comments`, { method: 'POST', body: JSON.stringify({ body }) });

if (!level) {
  await comment(
    [
      '## Not a level',
      '',
      'A level is a branch you create, named `level-01` … `level-10`:',
      '',
      '```bash',
      'git checkout -b level-01 main',
      'echo "my attempt" > attempts/01.md',
      'git add . && git commit -m "level 01"',
      'git push -u origin level-01',
      '```',
    ].join('\n'),
  );
  process.exit(0);
}

const response = await fetch(JUDGE_URL, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  // The pull request body IS the request under judgement.
  body: JSON.stringify({ level, request: PR_BODY, player: PLAYER }),
});

const result = await response.json().catch(() => ({}));

if (result.disqualified) {
  await comment(
    `## DISQUALIFIED\n\n${result.error}\n\n` +
      `Rule: \`${result.rule}\`. The fair play rules are in the README, and they ` +
      'are about what was done, never about how it was written.',
  );
  process.exit(0);
}

if (!response.ok) {
  // Not a pass. The reviewer being unreachable is the one case where a player
  // has an incentive to make it unreachable.
  await comment(
    `## REFUSED ❌\n\n${result.error ?? 'The reviewer could not be reached.'}\n\n` +
      'An unavailable reviewer is not an approval.',
  );
  process.exit(0);
}

// Levels unlock in order, and a locked one never reached the model, so there
// is no number to report — say so plainly rather than printing an empty verdict.
if (result.locked) {
  await comment(
    `## LOCKED 🔒\n\n${result.error}\n\n` +
      `\`\`\`bash\ncat levels/${result.next}/RULE.md\ngit checkout -b level-${result.next} main\n\`\`\``,
  );
  process.exit(0);
}

// Binary. The number still reaches the player below, so a near miss reads as one.
const HEAD = result.won ? '## APPROVED ✅\n\nYou beat it.' : '## REFUSED ❌';

/** The number the player scored, and the one they needed. */
function detail(outcome) {
  const a = outcome.answer;
  if (!a) return '';
  if (a.type === 'noul') return `\`${a.noul.toFixed(3)}\``;
  if (a.type === 'score') return `\`${a.score.toFixed(2)}\` at confidence \`${a.confidence.toFixed(2)}\``;
  if (a.type === 'choice') {
    return Object.entries(a.probabilities)
      .sort((x, y) => y[1] - x[1])
      .slice(0, 3)
      .map(([k, v]) => `\`${k} ${v.toFixed(2)}\``)
      .join(' · ');
  }
  return '';
}

const body = [
  HEAD,
  '',
  ...result.outcomes.flatMap((o) => [
    `**\`${o.rule}\`** — ${o.verdict}`,
    '',
    `> ${o.reason}`,
    '',
    detail(o),
    '',
  ]),
  '---',
  '',
  `<sub>Answered by \`${result.models.join(', ') || 'unavailable'}\` in ${result.latency_ms}ms. ` +
    `Question hash \`${result.question_hash ?? '—'}\` — the reviewer cannot move the goalposts without this changing. ` +
    `Rule: [\`levels/${level}/RULE.md\`](../blob/main/levels/${level}/RULE.md).</sub>`,
].join('\n');

await comment(body);

if (result.won) {
  // The win is a real merge. That is most of why the game lives on GitHub.
  await api(`/pulls/${PR_NUMBER}/merge`, {
    method: 'PUT',
    body: JSON.stringify({ merge_method: 'squash', commit_title: `${PR_TITLE} (level ${level})` }),
  });

  // Claim the place on the board. The server re-checks all of this against
  // GitHub, so nothing here is trusted — a failed claim is reported to the
  // player rather than retried or hidden.
  const claim = await fetch(JUDGE_URL.replace(/\/judge$/, '/win'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ level, repo: REPO, pr: Number(PR_NUMBER), player: PLAYER }),
  });
  const outcome = await claim.json().catch(() => ({}));

  if (outcome.recorded) {
    await comment(`On the board: **${PLAYER}**, level ${level}.`);
  } else if (outcome.error) {
    await comment(`Merged, but not recorded on the board — ${outcome.error}.`);
  }

  // Redact the winning request now that it has been read and recorded.
  //
  // A copy has to be public to appear on the board, which would otherwise
  // publish a working answer to every level its owner has beaten — findable
  // from the board, or from anyone's repository list. The verdict and the
  // number stay in the comments; only the text that won is removed.
  await api(`/pulls/${PR_NUMBER}`, {
    method: 'PATCH',
    body: JSON.stringify({
      body:
        `_Redacted after the win was recorded, so this copy does not publish a ` +
        `working answer to level ${level}. The verdict is in the comments below._`,
    }),
  });
}
