import axios from 'axios';
import ordinal from 'ordinal';
import YAML from 'yamljs';
import { getCountryYamlUrl } from '../config';

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

  // Parse YAML properly instead of string splitting
  const parsed = YAML.parse(data);

  if (!Array.isArray(parsed)) {
    return null;
  }

  const userData = parsed.find(
    (entry: { login?: string; username?: string }) =>
      entry.login === username || entry.username === username,
  );

  if (!userData || typeof userData.rank !== 'number') {
    return null;
  }

  return ordinal(userData.rank);
}
