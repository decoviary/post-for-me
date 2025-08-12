import type { ComponentType } from "react";
import type { Route } from "./+types/route";

export type LoaderData = Route.ComponentProps["loaderData"];

// Main form data structure
export interface FormData {
  caption: string;
  title?: string;
  privacyStatus?: "public" | "private";
  allowComment?: boolean;
  allowDuet?: boolean;
  allowStitch?: boolean;
  discloseContent?: boolean;
  discloseYourBrand?: boolean;
  discloseBrandedContent?: boolean;
  media: MediaItem[];
}

// Media-related types
export interface MediaItem {
  id: string;
  type: "video" | "link";
  url: string;
  name: string;
  preview?: string;
}

// Platform configuration
export interface Platform {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  tab: ComponentType;
}

// Component Props interfaces
export interface MediaListProps {
  items: MediaItem[];
  onRemove?: (id: string) => void;
}

export interface MediaListItemProps {
  item: MediaItem;
  onRemove?: (id: string) => void;
}

export interface MediaLinkFormProps {
  onCancel: () => void;
  onSubmit: (url: string) => void;
}

export interface MediaActionsProps {
  onAddMedia: (url: string) => void;
}

// TikTok-specific types
export type PrivacyStatus = "public" | "private";

export interface TikTokFormData {
  title: string;
  privacyStatus: PrivacyStatus;
  allowComment: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  discloseContent: boolean;
  discloseYourBrand: boolean;
  discloseBrandedContent: boolean;
}
