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
const result = {};
const currentYear = new Date().getUTCFullYear();

for (const year of [currentYear - 1, currentYear]) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: 'olayresjames', from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` } }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors) throw new Error(JSON.stringify(payload.errors || payload));
  const calendar = payload.data.user.contributionsCollection.contributionCalendar;
  result[year] = { total: calendar.totalContributions, weeks: calendar.weeks.map(week => week.contributionDays.map(day => levelMap[day.contributionLevel])) };
}

await mkdir('public', { recursive: true });
await writeFile('public/github-contributions.json', `${JSON.stringify(result, null, 2)}\n`);
