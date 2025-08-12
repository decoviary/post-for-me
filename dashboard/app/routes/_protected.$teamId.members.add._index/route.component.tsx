import { useState } from "react";
import { useRouteLoaderData, useNavigate } from "react-router";

import { TagInput } from "~/ui/tag-input";

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

import type { Tag } from "~/ui/tag-input";
import type { loader } from "~/routes/_protected.$teamId.members/route";

export function Component() {
  const data = useRouteLoaderData<typeof loader>(
    "routes/_protected.$teamId.members"
  );
  const navigate = useNavigate();
  const { Form, errors, isSubmitting, fetcher } = useForm();
  const [emails, setEmails] = useState<Tag[]>([]);

  const teamName = data?.team?.name || "this team";
  const title = `Invite team members to join ${teamName}`;
  const description =
    "Member of your team will be able to access projects, API keys, and billing.";
  const disabled =
    emails.length === 0 || emails.some((tag) => tag.variant === "destructive");

  function goBack() {
    navigate(-1);
  }

  function handleTagsChange(tags: Tag[]) {
    setEmails(tags);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    emails
      .map(({ text }) => text.trim())
      .filter(Boolean)
      .forEach((email) => {
        formData.append("emails", email);
      });

    fetcher.submit(formData, {
      method: "post",
    });
  }

  return (
    <Dialog open onOpenChange={goBack}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form method="post" className="grid gap-6" onSubmit={handleSubmit}>
          <p className="empty:hidden italic text-destructive text-sm">
            {errors.general}
          </p>

          <TagInput
            value={emails}
            onChange={handleTagsChange}
            disabled={isSubmitting}
            validator={(tagValue) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tagValue)
            }
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={goBack}>
              Cancel
            </Button>

            <Button type="submit" disabled={disabled}>
              Add users
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
