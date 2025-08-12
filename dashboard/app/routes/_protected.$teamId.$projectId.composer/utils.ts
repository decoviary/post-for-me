import unset from "lodash/unset";

import { deepClean } from "~/lib/utils";

import type { FormSchema } from "./schema";

const INVALID_FIELDS = ["_disclose_content", "_providers"];

export const cleanPayload = (obj: FormSchema) => {
  const result = { ...obj };

  INVALID_FIELDS.forEach((key) => {
    unset(result, key);
  });

  if (result.media) {
    result.media = result.media.map((media) => ({
      url: media.url,
    }));
  }

  return deepClean(result);
};
