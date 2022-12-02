import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
// function getItem(label, key, icon, children = null, type = null) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   };
// }
// const items = [
//   getItem('Dashboard', 'sub0', <MailOutlined />),
//   getItem('Quản lí trạm', 'sub1', <MailOutlined />, [
//     getItem('Thông tin trạm', '1'),
//     getItem('Dữ liệu trạm', '2'),
//     getItem('Người dùng', '3'),
//   ]),
//   getItem('Đơn hàng', 'sub2', <AppstoreOutlined />, [
//     getItem('Dữ liệu', '4'),
//     getItem('Đơn hàng đang chờ', '5'),
//   ]),
//   getItem('Navigation Three', 'sub4', <SettingOutlined />, [
//     getItem('Option 9', '6'),
//     getItem('Option 10', '7'),
//     getItem('Option 11', '8'),
//     getItem('Option 12', '9'),
//   ]),
// ];
// const MenuBarCustomer = () => {
//   const [current, setCurrent] = useState('1');
//   const onClick = (e) => {
//     console.log('click ', e);
//     setCurrent(e.key);
//   };
//   return (
//     <>
//       <Menu
//         theme={'light'}
//         onClick={onClick}
//         style={{
//           width: 256,
//         }}
//         defaultOpenKeys={['sub1']}
//         selectedKeys={[current]}
//         mode="inline"
//         items={items}
//       />
//     </>
//   );
// };


const MenuBar = ({ menuList, mode, className, ...props }) => {
  const navigate = useNavigate()

  return (
    <Menu
    mode={mode}
    className={className}
    selectedKeys={[]}
    defaultOpenKeys={[]}
    >
      {
        menuList.filter(item=> !item.isHide)
        .map(item => {
          if(item.children && item.children.length > 0) {
            return (
              <Menu.SubMenu
              title={item.title}
              key={item.key}
              icon={item.icon}
              >
                {
                  item.children.filter(subMenu => !subMenu.isHide)
                  .map(subMenu => (
                    
                    <Menu.Item
                    onClick={() => {
                      navigate(subMenu.url)
                    }}
                    key={subMenu.id}
                    >
                      {subMenu.title}
                    </Menu.Item>
                    )
                  )}
              </Menu.SubMenu>
            )
          }
          else {
            return (
              <Menu.Item
              key={item.id}
              icon={item.icon}
              onClick={() => {
                navigate(item.url)
              }}
              >
                {item.title}
              </Menu.Item>
            )
          }
        })
      }
    </Menu>
  )
}

export default MenuBar;