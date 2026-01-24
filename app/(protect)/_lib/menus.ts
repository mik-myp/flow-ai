import { Brain, LucideIcon, Workflow } from "lucide-react";

const menus: {
  title: string;
  url: string;
  icon: LucideIcon;
}[] = [
  {
    title: "工作流",
    url: "/workflows",
    icon: Workflow,
  },
  {
    title: "模型",
    url: "/models",
    icon: Brain,
  },
];

export default menus;
