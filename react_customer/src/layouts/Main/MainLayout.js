import React, { useEffect } from "react";
import { LikeFilled, UserOutlined } from "@ant-design/icons";
import HeaderCustomer from "../../components/Header";
import { Breadcrumb, Layout } from "antd";
import MenuBar from "../../components/MenuBar";
import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import ReBreadcrumb from "../../components/Breadcrumb";
import { Col } from "antd";
import { useSelector } from "react-redux";
const { Header, Content, Sider } = Layout;

const checkRole = (list, ...permissions) => {
  if (list !== undefined){
    if (list.includes("1") || list.includes("2"))
      return false;
    else {
      if (permissions[0] === undefined)
        return true;
      else {
        let check = true;
        for(let i = 0; i < permissions.length; i++){
          let num = permissions[i];
          let perID = num.toString();
          if (list.includes(perID)){
            check = false;
            break;
          }
        }
        return check;
      }
    } 
  }
};

const MenuList = (list) => [
  {
    id: "/dashboard",
    title: "Dashboard",
    icon: <UserOutlined />,
    isHide: false,
    url: "/customer/dashboard",
  },
  {
    id: "/manage_station",
    title: "Quản lí trạm",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "manage_account/type_customer",
        title: "Người dùng",
        isHide: checkRole(list,20,21,22,23),
        url: "/customer/station/user",
      },
      {
        id: "/admin/list_station/type-adminLocation",
        title: "Danh sách trạm",
        isHide: checkRole(list,20,21,22,23),
        url: "/customer/station/list_station",
      },
      {
        id: "/admin/data_station/type-adminLocation",
        title: "Dữ liệu trạm",
        isHide: checkRole(list,20,21,22,23),
        url: "/customer/station/station_data",
      },
    ],
  },
  {
    id: "/newspaper",
    title: "Quản lí bài báo",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "my_newspaper/type_customer",
        title: "Bài báo của tôi",
        isHide: checkRole(list,30,31,32,33),
        url: "/customer/my_newspaper",
      },
      {
        id: "/admin/register_newspaper/type-adminLocation",
        title: "Viết bài",
        isHide: checkRole(list,30,34),
        url: "/customer/register_newspaper",
      },
    ],
  },
  {
    id: "/manage_courses",
    title: "Quản lí khóa học",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "courses/type_customer",
        title: "Khóa học",
        isHide: checkRole(list),
        url: "/customer/courses",
      },
      {
        id: "/admin/create-course/type-adminLocation",
        title: "Tạo khóa học",
        isHide: checkRole(list),
        url: "/customer/courses/create_course",
      },
      {
        id: "exercises/type_customer",
        title: "Bài tập",
        isHide: checkRole(list),
        url: "/customer/courses/exercises",
      },
      {
        id: "/admin/create-exercise/type-adminLocation",
        title: "Tạo bài tập",
        isHide: checkRole(list),
        url: "/customer/courses/create_exercises",
      },
    ],
  },
  {
    id: "/invoice",
    title: "Hóa đơn",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "station_information/type_customer",
        title: "Thông tin đặt trạm",
        isHide: checkRole(list),
        url: "/customer/invoice/station_information",
      },
      {
        id: "admin/create-invoice/type-adminLocation",
        title: "Tạo hóa đơn",
        isHide: checkRole(list),
        url: "/customer/invoice/create_invoice",
      },
    ],
  },
  {
    id: "/advertisement",
    title: "Quảng cáo",
    icon: <UserOutlined />,
    isHide: false,
    url: "/customer/advertisement",
  },
  {
    id: "/account",
    title: "Tài khoản",
    icon: <UserOutlined />,
    isHide: false,
    url: "/customer/account",
  },
  {
    id: "/support",
    title: "Hỗ trợ",
    icon: <UserOutlined />,
    isHide: false,
    url: "/customer/support",
  },
  {
    id: "/settings",
    title: "Thiết lập",
    icon: <UserOutlined />,
    isHide: false,
    url: "/customer/settings",
  },
];

const MainLayout = () => {
  // const { authenticate, permissions, clearAuthenticate} = useUser();
  const navigate = useNavigate();

  let customer_info = useSelector(state => state.authSlice.userInformation);
  let sidebarList = customer_info.sidebar;
  // useEffect(() => {
  //   const token = localStorage.getItem("token_AirSENSE");
  //   const username = localStorage.getItem("username");
  //   if (!token || !username) navigate("/login");
  // }, [
  //   localStorage.getItem("token_AirSENSE"),
  //   localStorage.getItem("username"),
  // ]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header-customer">
        <HeaderCustomer />
      </Header>
      <Layout>
        <Sider width={215} className="site-layout-background" theme="light">
          <MenuBar menuList={MenuList(sidebarList)} mode="inline" />
        </Sider>

        <Content className="customer-main-content">
          {/* <Breadcrumb style={{margin:"12px 20px"}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          {/* <ReBreadcrumb menuList={MenuList}></ReBreadcrumb> */}
          <Col span={22} offset={1} className="outlet-container">
            <Outlet />
          </Col>
        </Content>
      </Layout>
    </Layout>
    // </Layout>
  );
};
export default MainLayout;
