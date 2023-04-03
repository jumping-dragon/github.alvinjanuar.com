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
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch(GITHUB_API_ENDPOINT + "/search/repositories?per_page=5&q=" + encodeURIComponent(input.text)
      )
      const parsedResponse = await response.json() as SearchRepoResponse
      return parsedResponse
    }),
});


type SearchRepoResponse = {
  total_count: number,
  incomplete_results: boolean,
  items: RepositoryMetadata[]
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
