import { z } from 'zod';

export const badgeParamsSchema = z.object({
  country: z.string().describe('The country name.'),
  username: z.string().describe('The username.'),
});

export const badgeQuerySchema = z.object({
  category: z
    .enum(['all', 'commits', 'contributes'])
    .default('all')
    .describe('The category of ranking to fetch (all, commits, or contributes).'),
  style: z
    .enum(['flat', 'plastic', 'flat-square', 'for-the-badge', 'social'])
    .default('flat')
    .describe('Set the style of the badge.'),
  label: z
    .string()
    .default('Most Active GitHub User Rank')
    .describe('Set the left-hand-side text.'),
  labelColor: z
    .string()
    .default('')
    .describe('Set background color of the left part.'),
  color: z
    .string()
    .default('')
    .describe('Set background color of the right part.'),
  rnkPrefix: z
    .string()
    .default('')
    .describe('The prefix to display before the rank value.'),
  rnkSuffix: z
    .string()
    .default('')
    .describe('The suffix to display after the rank value.'),
});

export const rankParamsSchema = z.object({
  country: z.string().describe('The country name.'),
  username: z.string().describe('The username.'),
});

export const rankQuerySchema = z.object({
  category: z
    .enum(['all', 'commits', 'contributes'])
    .default('all')
    .describe('The category of ranking to fetch (all, commits, or contributes).'),
});

export const rankResponseSchema = z.object({
  rank: z.string().nullish(),
});
