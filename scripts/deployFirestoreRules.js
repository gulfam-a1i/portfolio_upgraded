import { readFileSync } from 'node:fs';
import { GoogleAuth } from 'google-auth-library';

const serviceAccount = JSON.parse(readFileSync('serviceAccountKey.json', 'utf8'));
const projectId = serviceAccount.project_id;
const rules = readFileSync('firestore.rules', 'utf8');

const auth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/firebase'],
});

const client = await auth.getClient();
const token = await client.getAccessToken();
const headers = {
  Authorization: `Bearer ${token.token}`,
  'Content-Type': 'application/json',
};

const rulesetResponse = await fetch(`https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    source: {
      files: [{ name: 'firestore.rules', content: rules }],
    },
  }),
});

if (!rulesetResponse.ok) {
  throw new Error(`Ruleset create failed: ${rulesetResponse.status} ${await rulesetResponse.text()}`);
}

const ruleset = await rulesetResponse.json();
const releaseName = `projects/${projectId}/releases/cloud.firestore`;
const releaseResponse = await fetch(`https://firebaserules.googleapis.com/v1/${releaseName}?updateMask=rulesetName`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({
    release: {
      name: releaseName,
      rulesetName: ruleset.name,
    },
    updateMask: 'rulesetName',
  }),
});

if (!releaseResponse.ok) {
  throw new Error(`Rules release failed: ${releaseResponse.status} ${await releaseResponse.text()}`);
}

console.log(`Firestore rules deployed: ${ruleset.name}`);
