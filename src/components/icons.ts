import {
  BrainCircuit,
  Layers,
  LayoutTemplate,
  Server,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Central map from role icon names → lucide components. */
export const ICONS: Record<string, LucideIcon> = {
  LayoutTemplate,
  Server,
  Users,
  BrainCircuit,
};

export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? Layers;
}
