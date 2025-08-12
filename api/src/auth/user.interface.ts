/**
 * Represents the authenticated user object attached to the request
 * within routes protected by AuthGuard.
 */
export interface RequestUser {
  id: string; // ID is guaranteed to be a string here
  projectId: string; // ProjectId is guranteed to be a string here
  apiKey: string;
  teamId: string;
}
