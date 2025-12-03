import { Button } from "antd";

const ButtonComponent = ({type = 'primary', size = 'default', clx = null, content, danger = null, handle = null}) => {
  return (
    <>
    {
      !!danger?(
        <Button type={type} danger className={clx} size={size} onClick={handle}>
      {content}
    </Button>
      ):
      (
        <Button type={type} className={clx} size={size} onClick={handle} >
      {content}
    </Button>
      )
    }
    </>
  );
};

export default ButtonComponent;
