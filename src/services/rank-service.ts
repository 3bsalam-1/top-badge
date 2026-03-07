import axios from 'axios';
import ordinal from 'ordinal';
import YAML from 'yamljs';
import { getCountryYamlUrl } from '../config/index.js';

export class UserNotFoundError extends Error {
  constructor(username: string, country: string) {
    super(`User '${username}' not found in country '${country}'`);
    this.name = 'UserNotFoundError';
  }
}

export async function getOrdinalRank(
  username: string,
  country: string,
): Promise<string | null> {
  const url = getCountryYamlUrl(country);

  const { data } = await axios<string>({
    url,
  });

  // Original approach: split by blank lines to handle multiple YAML documents
  const userData = data.split('\n\n').find((u) => u.includes(username));
  if (!userData) {
    return null;
  }

  const parsed = YAML.parse(userData);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    return null;
  }

  const userEntry = parsed[0];
  if (typeof userEntry?.rank !== 'number') {
    return null;
  }

  return ordinal(userEntry.rank);
}
