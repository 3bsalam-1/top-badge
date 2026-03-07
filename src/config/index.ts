import { z } from 'zod';

export const configSchema = z.object({
  github: z.object({
    owner: z.string().default('ashkulz'),
    repo: z.string().default('committers.top'),
    branch: z.string().default('gh-pages'),
    locationsPath: z.string().default('_data/locations'),
  }),
  server: z.object({
    port: z.coerce.number().default(3000),
    host: z.string().default('::'),
  }),
  cache: z.object({
    ttl: z.number().default(3600), // 1 hour in seconds
    enabled: z.boolean().default(true),
  }),
  badge: z.object({
    defaultStyle: z
      .enum(['flat', 'plastic', 'flat-square', 'for-the-badge', 'social'])
      .default('flat'),
    defaultLabel: z.string().default('Most Active GitHub User Rank'),
    defaultColor: z.string().default('brightgreen'),
    defaultLabelColor: z.string().default('grey'),
  }),
});

export type Config = z.infer<typeof configSchema>;

const envConfig = {
  GITHUB_OWNER: process.env.GITHUB_OWNER,
  GITHUB_REPO: process.env.GITHUB_REPO,
  GITHUB_BRANCH: process.env.GITHUB_BRANCH,
  LOCATIONS_PATH: process.env.LOCATIONS_PATH,
  SERVER_PORT: process.env.PORT,
  SERVER_HOST: process.env.SERVER_HOST,
  CACHE_TTL: process.env.CACHE_TTL,
  CACHE_ENABLED: process.env.CACHE_ENABLED,
};

export const config: Config = {
  github: {
    owner: envConfig.GITHUB_OWNER ?? 'ashkulz',
    repo: envConfig.GITHUB_REPO ?? 'committers.top',
    branch: envConfig.GITHUB_BRANCH ?? 'gh-pages',
    locationsPath: envConfig.LOCATIONS_PATH ?? '_data/locations',
  },
  server: {
    port: envConfig.SERVER_PORT ? Number(envConfig.SERVER_PORT) : 3000,
    host: envConfig.SERVER_HOST ?? '::',
  },
  cache: {
    ttl: envConfig.CACHE_TTL ? Number(envConfig.CACHE_TTL) : 3600,
    enabled: envConfig.CACHE_ENABLED === 'true' || !envConfig.CACHE_ENABLED,
  },
  badge: {
    defaultStyle: 'flat',
    defaultLabel: 'Most Active GitHub User Rank',
    defaultColor: 'brightgreen',
    defaultLabelColor: 'grey',
  },
};

export function getCountryYamlUrl(country: string): string {
  const { owner, repo, branch, locationsPath } = config.github;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${locationsPath}/${country}.yml`;
}
