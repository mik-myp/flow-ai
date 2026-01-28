const NodeField = ({ label, content }: { label: string; content: string }) => {
  return (
    <div className="flex">
      <div>{label}：</div>
      <div className="line-clamp-2 flex-1">{content}</div>
    </div>
  );
};
export default NodeField;
