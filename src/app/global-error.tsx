'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>Oops! Something went wrong</h1>
        <p>Error: {error.message}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
