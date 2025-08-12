import { LoopsClient } from "loops";

import { LOOPS_API_KEY } from "~/lib/.server/loops.constants";

export const loops = LOOPS_API_KEY ? new LoopsClient(LOOPS_API_KEY) : null;
