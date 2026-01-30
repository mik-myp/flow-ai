const NodeField = ({ label, content }: { label: string; content: string }) => {
  return (
    <div className="flex items-start gap-1.5 text-xs leading-5">
      <div className="shrink-0 text-slate-500">{label}：</div>
      <div className="line-clamp-2 flex-1 text-slate-800">{content || "-"}</div>
    </div>
  );
};
export default NodeField;
