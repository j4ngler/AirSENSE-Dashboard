import { Button } from "antd";
const ButtonDanger = ({children}) => {
  return (
    <Button type="primary" style={{ backgroundColor: "#dc3545" }}>
      {children}
    </Button>
  );
};
export default ButtonDanger