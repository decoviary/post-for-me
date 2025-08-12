import { Link } from "react-router";

import { Button } from "~/ui/button";

export function Hero() {
  return (
    <div className="@container/hero grid grid-cols-1 lg:grid-cols-2 items-center">
      <div className="flex flex-col gap-6 py-8 col-span-1 sm:col-span-2 lg:col-span-1">
        <h1 className="relative flex flex-col text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug">
          <span className="text-balance z-10">
            {"Integrate with TikTok, Facebook, Instagram, YouTube, and more"}
          </span>

          <span>
            {`in minutes,`}
            <span className="bg-accent text-accent-foreground px-4 py-2 rounded-2xl w-fit -mr-3">
              not weeks
            </span>
            .
          </span>
        </h1>

        <p className="md:text-2xl text-muted-foreground max-w-2xl text-balance">
          <span className="font-bold">Connect social media accounts</span>
          {` and `}
          <span className="font-bold">schedule posts</span> through your app.
        </p>

        <Button asChild className="self-start">
          <Link to="/app">Start for Free</Link>
        </Button>
      </div>

      <div>
        <img
          className="hidden lg:block"
          src="/hero-img.png"
          alt="Use a single API to post to TikTok, Facebook, Instagram, YouTube, X (Twitter), LinkedIn, Pinterest, Threads, and Bluesky"
        />

        <img
          className="lg:hidden"
          src="/hero-mobile.png"
          alt="Use a single API to post to TikTok, Facebook, Instagram, YouTube, X (Twitter), LinkedIn, Pinterest, Threads, and Bluesky"
        />
      </div>
    </div>
  );
}
