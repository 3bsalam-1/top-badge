import axios from 'axios';
import ordinal from 'ordinal';
import YAML from 'yamljs';
import { config, getCountryYamlUrl } from '../config/index.js';
import { Cache } from '../utils/cache.js';

// Create a cache for rank data (1 hour TTL)
// Exported for testing purposes (only if caching is enabled)
let rankCache: Cache<Record<string, string>> | null = null;

function getRankCache(): Cache<Record<string, string>> | null {
  if (!config.cache.enabled) return null;
  if (!rankCache) {
    // Use default maxSize of 50 countries (can be made configurable)
    // Note: Each country entry stores all users for that country as a Record<string, string>.
    // For countries with many users (e.g., USA, India), this could consume significant memory.
    // Consider implementing per-entry size limits if memory becomes a concern.
    rankCache = new Cache<Record<string, string>>(config.cache.ttl, 50);
  }
  return rankCache;
}

// Reset the rank cache - useful for testing
export function resetRankCache(): void {
  rankCache?.clear(); // Clear existing cache entries before nulling
  rankCache = null;
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

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
  // Normalize country to lowercase for consistent cache key and URL
  const normalizedCountry = country.toLowerCase();
  const cacheKey = normalizedCountry;

  const cache = getRankCache();

  // Check cache first
  if (cache) {
    const cachedRank = cache.get(cacheKey);
    if (cachedRank) {
      // If user is not in cached data, fetch fresh data to ensure we don't
      // return null for new users added after cache was populated
      if (username in cachedRank) {
        return cachedRank[username] ?? null;
      }
      // User not found in cache - fall through to fetch fresh data
    }
  }

  const url = getCountryYamlUrl(normalizedCountry);

  let data: string;
  try {
    const response = await axios<string>({
      url,
    });
    data = response.data;
  } catch (error) {
    // Distinguish network errors from user not found - re-throw network errors
    if (axios.isAxiosError(error)) {
      const message = `Failed to fetch rank data for ${country}: ${error.message}`;
      console.error(message);
      throw new NetworkError(message);
    }
    // Non-network errors - treat as user not found
    console.error(`Unexpected error fetching rank data for ${country}: ${error instanceof Error ? error.message : error}`);
    return null;
  }

  // Parse all users from the YAML
  const userRanks: Record<string, string> = {};
  const userDataBlocks = data.split('\n\n');

  for (const block of userDataBlocks) {
    try {
      const parsed = YAML.parse(block);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        const userEntry = parsed[0];
        if (userEntry?.login || userEntry?.username) {
          const userKey = userEntry.login ?? userEntry.username;
          if (typeof userEntry.rank === 'number') {
            userRanks[userKey] = ordinal(userEntry.rank);
          }
        }
      }
    } catch (error) {
      // Skip invalid YAML blocks but log the error for debugging
      console.warn(
        `Failed to parse YAML block for ${country}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  // Cache the results for this country
  const rankCacheInstance = getRankCache();
  if (rankCacheInstance) {
    rankCacheInstance.set(cacheKey, userRanks);
  }

  return userRanks[username] ?? null;
}
