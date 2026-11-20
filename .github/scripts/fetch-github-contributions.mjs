import { mkdir, writeFile } from 'node:fs/promises';

const token = process.env.GH_CONTRIBUTIONS_TOKEN;
if (!token) throw new Error('GH_CONTRIBUTIONS_TOKEN is missing');

const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount contributionLevel date } }
      }
    }
  }
}`;

const levelMap = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const currentYear = new Date().getUTCFullYear();

function serializeCalendar(calendar) {
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map(week => week.contributionDays.map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: levelMap[day.contributionLevel],
    }))),
  };
}

async function fetchCalendar(from, to) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: 'olayresjames', from, to } }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors || !payload.data?.user) throw new Error(JSON.stringify(payload.errors || payload));
  const calendar = payload.data.user.contributionsCollection.contributionCalendar;
  return serializeCalendar(calendar);
}

const today = new Date();
const recentTo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));
const recentFromYear = recentTo.getUTCFullYear() - 1;
const recentFromDay = Math.min(
  recentTo.getUTCDate(),
  new Date(Date.UTC(recentFromYear, recentTo.getUTCMonth() + 1, 0)).getUTCDate(),
);
const recentFrom = new Date(Date.UTC(recentFromYear, recentTo.getUTCMonth(), recentFromDay));
const result = {
  recent: {
    from: recentFrom.toISOString().slice(0, 10),
    to: recentTo.toISOString().slice(0, 10),
    ...await fetchCalendar(recentFrom.toISOString(), recentTo.toISOString()),
  },
};

for (const year of [currentYear - 1, currentYear]) {
  result[year] = await fetchCalendar(`${year}-01-01T00:00:00Z`, `${year}-12-31T23:59:59Z`);
}

await mkdir('public', { recursive: true });
await writeFile('public/github-contributions.json', `${JSON.stringify(result, null, 2)}\n`);
