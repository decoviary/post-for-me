import { useEffect } from "react";
import { useRouteLoaderData, useNavigate, useSearchParams } from "react-router";

import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";

import { useForm } from "~/hooks/use-form";

import type { loader } from "~/routes/_protected.$teamId.members/route";

export function Component() {
  const [searchParams] = useSearchParams();
  const data = useRouteLoaderData<typeof loader>(
    "routes/_protected.$teamId.members"
  );
  const navigate = useNavigate();
  const { Form, errors, success } = useForm();

  const teamName = data?.team?.name || "this team";
  const userId = searchParams.get("user_id");
  const user = data?.members.find((m) => m && m.id === userId);
  const title = user?.isCurrentUser
    ? `Leave ${teamName}`
    : `Remove ${user?.email || "this user"} from ${teamName}`;

  const description = user?.isCurrentUser
    ? `You will no longer be able to access the team or its resources, but can be added back at a later time.`
    : `They will no longer be able to access the team or its resources, but can be added back at a later time.`;

  function goBack() {
    navigate(-1);
  }

  useEffect(() => {
    if (!searchParams.has("user_id")) {
      goBack();
    }
  }, [searchParams]);

  return (
    <Dialog open onOpenChange={goBack}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div>
            <p className="text-sm italic text-affirmative">
              User successfully removed from team
            </p>

            <DialogFooter>
              <Button type="button" onClick={goBack}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form method="post" className="grid gap-6">
            <p className="empty:hidden italic text-destructive text-sm">
              {errors.general}
            </p>

            <input type="hidden" name="userId" value={`${userId}`} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={goBack}>
                Cancel
              </Button>

              <Button variant="destructive" type="submit">
                Remove User
              </Button>
            </DialogFooter>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
