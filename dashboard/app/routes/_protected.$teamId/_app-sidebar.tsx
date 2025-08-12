import * as React from "react";

import { TeamNav } from "./_team-nav";
import { ProjectsNav } from "./_projects-nav";
import { TeamSwitcher } from "./_team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "~/ui/sidebar";
import { UserActions } from "./_user-actions";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <TeamNav />
      </SidebarHeader>
      <SidebarContent>
        <ProjectsNav />
      </SidebarContent>
      <SidebarFooter>
        <UserActions />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
