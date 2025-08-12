import { Link } from "react-router";

import { APP_URL } from "~/lib/constants";

import { Button } from "~/ui/button";

import { PricingTable } from "./_pricing-table";

export function Pricing() {
  return (
    <div className="flex flex-col gap-14">
      <div className="@container grid grid-cols-1 lg:grid-cols-2 gap-18">
        {/* Features Section */}
        <div className="grid grid-cols-3 gap-4">
          <h2 className="col-span-full text-4xl lg:text-5xl font-normal leading-tight max-w-2xl border-b mb-4 pb-4 text-balance">
            {"Only pay for posts that land."}
          </h2>

          <h3 className="max-md:col-span-full font-bold text-primary">
            Pay-per-success
          </h3>
          <p className="col-span-3 @md:col-span-2 mb-6 text-muted-foreground">
            {"You're billed only when a post is "}
            <span className="font-bold">confirmed live</span>. No seat licenses,
            no account bundles: just a clear cost per successful publish.
          </p>

          <h3 className="max-md:col-span-full  font-bold text-primary">
            Unlimited accounts and posts
          </h3>
          <p className="col-span-3 @md:col-span-2 mb-6 text-muted-foreground">
            {`Connect `}
            <span className="font-bold">as many social profiles</span>
            {` and `}
            <span className="font-bold">as many posts</span>
            {` as you need.
            If a platform's API supports it, so do we. No hidden limits or
            forced plan upgrades.`}
          </p>

          <h3 className="max-md:col-span-full font-bold text-primary">
            Volume discounts
          </h3>
          <p className="col-span-3 @md:col-span-2 text-muted-foreground">
            The more you post, the less you pay per post. Our tiered pricing
            meets you where you are, letting you get started quickly and scale
            reasonably.
          </p>

          <div className="col-span-full flex flex-row items-center md:items-start gap-2 mt-12">
            <Button asChild>
              <Link to={APP_URL}>Get Started for Free</Link>
            </Button>
          </div>
        </div>

        {/* Interactive Pricing Calculator */}
        <PricingTable />
      </div>
    </div>
  );
}
