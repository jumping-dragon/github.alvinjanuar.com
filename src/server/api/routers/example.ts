import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function delay<T>(t: number, v: T) {
  return new Promise<T>(resolve => setTimeout(resolve, t, v));
}

const GITHUB_API_ENDPOINT = "https://api.github.com"

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const a = await delay(3000, 'a');
      return {
        greeting: `Hello ${input.text + a}`,
      };
    }),
  search: publicProcedure
    .input(z.object({
      text: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.number().nullish(),
    }))
    .query(async ({ input }) => {
      const page = input.cursor ?? 1;
      const limit = input.limit ?? 10;

      const params = {
        per_page: limit,
        q: encodeURIComponent(input.text),
        page
      };

      const response = await fetch(GITHUB_API_ENDPOINT + '/search/repositories?' + convertToQuery(params))
      const data = await response.json() as SearchRepoResponse
      return {
        ...data,
        nextCursor: getNextPage(page, limit, data.total_count)
      }
    }),
});

const convertToQuery = (kv: { [key: string]: string | number }) => {
  return Object.entries(kv)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}

const getNextPage = (currentPage: number, limit: number, totalCount: number) => {
  const remainder = totalCount % limit;
  const totalPage = remainder > 0 ? totalCount / limit + 1 : totalCount / limit;
  if (currentPage + 1 <= totalPage) {
    return currentPage + 1
  }
}


type SearchRepoResponse = {
  total_count: number,
  incomplete_results: boolean,
  items: RepositoryMetadata[],
  // TODO: error handling
  message?: string
}

export type RepositoryMetadata = {
  full_name: string,
  html_url: string,
  description: string,
  language: string,
  languages_url: string,
  homepage: string,
  stargazers_count: number,
  pushed_at: Date,
  owner: {
    avatar_url: string,
    [k: string]: unknown
  },
  [k: string]: unknown
}
