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
        greeting: `Hello ${input.text}`,
      };
    }),
  search: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch(
        GITHUB_API_ENDPOINT + "/search/repositories?q=" + encodeURIComponent(input.text)
      )
      const parsedResponse = await response.json()
      return parsedResponse
    }),
});
