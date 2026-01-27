import type { ReactNode } from "react";

const NodeField = ({
  label,
  extra,
  children,
}: {
  label: string;
  extra?: string;
  children: ReactNode;
}) => {
  return (
    <div className="mb-4">
      <div className="mb-1 text-sm font-medium text-slate-600">{label}</div>
      {children}
      {extra ? (
        <div className="mt-1 text-xs text-slate-400">{extra}</div>
      ) : null}
    </div>
  );
};

export default NodeField;
