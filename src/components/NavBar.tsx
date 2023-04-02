import { type NextComponentType } from "next";
import * as Form from "@radix-ui/react-form";

import Link from "next/link";
import { type FormEvent } from "react";
import { useRouter } from "next/router";

const NavBar: NextComponentType = () => {
  const router = useRouter()

  return (
    <nav className="sm:flex w-full items-center justify-around border-b-2 border-b-blue-600 px-10 py-5">
      <Link href="/home">Home</Link>
      <Form.Root className="flex items-center" onSubmit={(event: FormEvent<HTMLFormElement>) => {
        const data = Object.fromEntries(new FormData(event.currentTarget))
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        router.push(`/search?q=${data.search}`)
          .catch(e => console.log(e))
        event.preventDefault()
      }}>
        <Form.Field name="search">
          <Form.Control asChild>
            <input type="text" value={router.query.q} required />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button>
            Search
          </button>
        </Form.Submit>
      </Form.Root>
      {/* <Link href='/search'>Search</Link> */}
      <Link href="/others">Others</Link>
      <div>github.alvinjanuar.com</div>
    </nav>
  );
};

export default NavBar;
