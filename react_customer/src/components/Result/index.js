import { Button, Result } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
const ResultPage = () => {
  const location = useLocation();
  const status = location.state.status;
  const title = location.state.title;
  const subTitle = location.state.subTitle;
  const finishedBtn = location.state.finishedBtn;
  const againBtn = location.state.againBtn;
  const navigate = useNavigate();
  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={[
        <Button
          type="primary"
          key="console"
          onClick={() => {
            navigate("/customer/dashboard");
          }}
        >
          {finishedBtn || "Quay về trang chủ"}
        </Button>,
        <Button
          key="buy"
          onClick={() => navigate}
        >
          <Link to={-1} replace={true}>
          {againBtn||"Tiếp tục"}
          </Link>
        </Button>,
      ]}
    />
  );
};
export default ResultPage;
