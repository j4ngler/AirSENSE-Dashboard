import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const antIcon = (size) => {
  if (size === "large") {
    size = 64;
  } else if (size === "medium") {
    size = 48;
  } else if (size === "small") {
    size = 24;
  }
  return (
    <LoadingOutlined
      style={{
        fontSize: size||48,
      }}
      spin
    />
  );
};
export const SpinLoading = ({size}) => <Spin indicator={antIcon(size)} />;
