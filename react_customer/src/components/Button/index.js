import { Button } from "antd";


let TypeButtonEnum = {
    
}


export const ButtonSucess = ({type, size, clx, title}) => {
  return (
    <Button type={type} className={clx} size={size} >
      {title}
    </Button>
  );
};
