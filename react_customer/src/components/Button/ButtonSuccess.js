import { Button } from "antd";
const ButtonSucess = ({ children }) => {
  return (
    <Button type="primary" style={{ backgroundColor: "#198754" }}>
      {children}
    </Button>
  );
};
export default ButtonSucess;
