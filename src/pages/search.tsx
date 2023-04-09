import { type NextPage } from "next"
import Head from "next/head";
import { useRouter } from "next/router";
import { useScroll, useMotionValueEvent } from "framer-motion";
import NavBar from "~/components/NavBar";

import { api } from "~/utils/api";

const Search: NextPage = () => {
  const router = useRouter()
  const text = String(router.query.q)
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = api.example.search.useInfiniteQuery({ text }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', () => {
    const parameter = scrollYProgress.get();
    if (parameter >= 0.8 && parameter <= 0.99 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((error) => console.log(error))
      // console.log("FETCHING NEXT PAGE", parameter)
    }
  })

  return (
    <>
      <Head>
        <title>{`Searching for ${text}`}</title>
        <meta name="description" content="generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <NavBar />
        {/* <pre className="text-sm text-white fixed right-5 bottom-4 w-1/2 h-1/2 overflow-auto"> */}
        {/*   {JSON.stringify({ data, error, isFetchingNextPage, isFetching, status }, '', 2)} */}
        {/* </pre> */}
        {data?.pages && (
          <div className="p-10">
            {data.pages[0]?.total_count && <div>Total Count: {data.pages[0]?.total_count}{'...' && data.pages[0]?.incomplete_results}</div>}
            {
              data?.pages.map((page) =>
                (page.items || []).map(({
                  full_name,
                  html_url,
                  language,
                  description,
                  homepage,
                  languages_url,
                  pushed_at,
                  stargazers_count,
                  owner
                }) => (
                  <div key={full_name} className="flex flex-col my-10">
                    <img className="w-20" src={owner.avatar_url} alt="baba" />
                    <div>{full_name}</div>
                    <a href={html_url}>{html_url}</a>
                    <a href={homepage}>{homepage}</a>
                    <div>{language}</div>
                    <p>{description}</p>
                    <p>Last Pushed:{pushed_at.toString()}</p>
                    <p>Star: {stargazers_count}</p>
                  </div>
                )))
            }
          </div>
        )}
        <div className="flex align-center justify-center">
          {error && <div className="text-sm text-white">{error.message}</div>}
          {isFetching && <div className="text-2xl text-white">Loading...</div>}
        </div>
      </main>
    </>
  );
};

export default Search;
