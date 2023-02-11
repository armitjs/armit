'use client';

/**
 * https://beta.nextjs.org/docs/routing/error-handling#handling-errors-in-root-layouts
 * @returns
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
