import { Alert, AlertDescription, AlertTitle } from "~/ui/alert";
import { Badge } from "~/ui/badge";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/ui/table";
import { useState } from "react";

const pricingTiers = [
  { posts: 50, cost: 0 },
  { posts: 999, cost: 5 },
  { posts: 1999, cost: 3.5 },
  { posts: 3999, cost: 2.5 },
  { posts: 7999, cost: 1.8 },
  { posts: 15999, cost: 1.3 },
  { posts: Infinity, cost: 1 },
];

function calculatePricingForPosts(totalPosts: number): string {
  let totalCost = 0;
  let remainingPosts = totalPosts;

  for (let i = 0; i < pricingTiers.length; i++) {
    const tier = pricingTiers[i];
    const prevTier = i > 0 ? pricingTiers[i - 1].posts : 0;
    const postsInTier = Math.min(remainingPosts, tier.posts - prevTier);

    if (postsInTier > 0) {
      totalCost += Math.round(postsInTier * tier.cost);
      remainingPosts -= postsInTier;
    }

    if (remainingPosts <= 0) break;
  }

  return (totalCost / 100).toFixed(2);
}

export function PricingTable() {
  const [calculatorPosts, setCalculatorPosts] = useState<number>(0);
  const calculatedTotal = calculatePricingForPosts(calculatorPosts);

  return (
    <div className="space-y-4">
      <Alert className="border-accent border-2">
        <AlertTitle className="line-clamp-none mb-2">
          <Badge variant="accent">Start for Free</Badge>
        </AlertTitle>
        <AlertDescription className="text-foreground flex flex-row items-baseline gap-4">
          <div className="text-5xl font-bold">
            $0
            <span className="text-lg text-muted-foreground font-normal">
              /month
            </span>
          </div>
          <div className="flex-1 h-full border-dashed border-b-2"></div>
          <div className="text-2xl">50 posts</div>
        </AlertDescription>
      </Alert>

      <Alert className="py-4 px-6">
        <AlertTitle className="text-xl mb-4 opacity-50 pb-3 border-b line-clamp-none text-balance h-auto">
          Pricing designed to grow with your needs
        </AlertTitle>

        <AlertDescription className="flex flex-col gap-6">
          {[100, 500, 1000, 5000, 10000].map((totalPosts) => {
            const totalCost = calculatePricingForPosts(totalPosts);

            return (
              <div
                key={totalPosts}
                className="text-foreground flex flex-row items-baseline gap-4"
              >
                <div className="text-2xl md:text-3xl font-bold">
                  ${totalCost}
                  <span className="text-lg text-muted-foreground font-normal">
                    /mo
                  </span>
                </div>
                <div className="flex-1 h-full border-dashed border-b-2"></div>
                <div className="text-xl md:text-2xl text-right">
                  {totalPosts.toLocaleString()} posts
                </div>
              </div>
            );
          })}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-center italic text-primary hover:cursor-pointer"
              >
                View full pricing table
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Usage based pricing breakdown</DialogTitle>
                <DialogDescription className="max-w-lg">
                  {`We price on a per-post basis. You get 50 posts free every month. As you post more, the cost per post decreases.`}
                </DialogDescription>
              </DialogHeader>
              <Table className="-mx-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Posts successfully delivered</TableHead>
                    <TableHead>Cost Per Post</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingTiers.map(({ posts, cost }, index) => {
                    const prevTier =
                      index > 0 ? pricingTiers[index - 1].posts : 0;
                    return (
                      <TableRow key={posts}>
                        <TableCell>{`${(prevTier + 1).toLocaleString()} - ${posts === Infinity ? "∞" : posts.toLocaleString()}`}</TableCell>
                        <TableCell>${(cost / 100).toFixed(3)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableCaption>{`*All prices are in USD.`}</TableCaption>
              </Table>

              <div>
                <div className="flex flex-row items-end gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <Label htmlFor="postsPerMonth" className="min-w-[120px]">
                      Posts per month
                    </Label>
                    <Input
                      type="number"
                      id="postsPerMonth"
                      min="0"
                      value={calculatorPosts || ""}
                      onChange={(e) => {
                        const posts = parseInt(e.target.value) || 0;
                        setCalculatorPosts(posts);
                      }}
                    />
                  </div>
                  <div className="flex items-baseline gap-0.5 text-2xl font-semibold">
                    ${calculatedTotal}
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </AlertDescription>
      </Alert>

      <Alert className="bg-muted">
        <AlertTitle className="text-muted-foreground text-xl">
          {`Want help getting started?`}
        </AlertTitle>
        <AlertDescription className="text-foreground flex flex-col md:flex-row gap-4 md:gap-8">
          <div>
            {`If you need additional support or the pricing doesn't work for your business, reach out to our team! We'd love to have a conversation and see how we can help you.`}
          </div>

          <Button variant={"outline"} asChild>
            <a href="mailto:postforme@daymoon.dev">Contact Us</a>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
