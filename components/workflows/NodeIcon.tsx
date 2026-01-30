import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

type NodeIconProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
};

const NodeIcon = ({ icon: Icon, size = 18, className }: NodeIconProps) => {
  return <Icon size={size} className={clsx("text-slate-700", className)} />;
};

export default NodeIcon;
