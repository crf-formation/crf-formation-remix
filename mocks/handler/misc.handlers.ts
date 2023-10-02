import type { RestHandler } from "msw";
import { bypass, rest } from "msw";

// put one-off handlers that don't really need an entire file to themselves here

const remixDevServerOrigin = `http://localhost:3001/*`;

const miscHandlers: RestHandler[] = [
  // msw breaks the remix dev server ping ("cannot clone body after it is used")
  // could not find out why, but it seems to be because of the interceptors (node_modules\@mswjs\interceptors\lib\node\interceptors\fetch\index.js:79:14)
  //
  // The following trickfix will make the fetch request to the remix dev server
  rest.post(remixDevServerOrigin, async ({ request }) => {
    console.log(`bypass ${request.method} ${request.url}`);

    // const response = await fetch(`${remixDevServerOrigin}/ping`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(await request.json())
    // }).catch(error => {
    //   console.error(`Could not reach Remix dev server at ${remixDevServerOrigin}`);

    // Performs an original request to the GitHub API.
    const fetchArgs = await bypass(request);

    return await fetch(...fetchArgs);
  }),
];

export { miscHandlers };
