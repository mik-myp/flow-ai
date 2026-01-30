import { Spin } from "antd";

const loading = () => {
  return (
    <Spin
      fullscreen
      classNames={{
        mask: "bg-white",
        indicator: "text-[#00d4ff]",
      }}
    ></Spin>
  );
};
export default loading; 
