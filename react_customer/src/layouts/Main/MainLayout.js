import React, { useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import HeaderCustomer from "../../components/Header";
import { Breadcrumb, Layout } from "antd";
import MenuBar from "../../components/MenuBar";
import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import ReBreadcrumb from "../../components/Breadcrumb";
const { Header, Content, Sider } = Layout;

const checkRole = (permissions) => {
  return false;
};

const MenuList = (permissions) => [
  {
    id: "/dashboard",
    title: "Dashboard",
    icon: <UserOutlined />,
    isHide: false,
    url: "/dashboard",
  },
  {
    id: "/manage_account",
    title: "Quản lí trạm",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "manage_account/type_customer",
        title: "Người dùng",
        isHide: checkRole(permissions),
        url: "/station/user",
      },
      {
        id: "/admin/manage-account/type-adminLocation",
        title: "Danh sách trạm",
        isHide: checkRole(permissions),
        url: "/station/list_station",
      },
      {
        id: "/admin/manage-account/type-adminLocation",
        title: "Dữ liệu trạm",
        isHide: checkRole(permissions),
        url: "/station/data_station",
      },
    ],
  },
  {
    id: "/manage_account",
    title: "Quản lí bài báo",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "manage_account/type_customer",
        title: "Bài báo của tôi",
        isHide: checkRole(permissions),
        url: "/station/user",
      },
      {
        id: "/admin/manage-account/type-adminLocation",
        title: "Viết bài",
        isHide: checkRole(permissions),
        url: "/station/data_station",
      },
    ],
  },
  {
    id: "/manage_account",
    title: "Quản lí khóa học",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "manage_account/type_customer",
        title: "Khóa học",
        isHide: checkRole(permissions),
        url: "/station/user",
      },
      {
        id: "/admin/manage-account/type-adminLocation",
        title: "Tạo khóa học",
        isHide: checkRole(permissions),
        url: "/station/data_station",
      },
      {
        id: "manage_account/type_customer",
        title: "Bài tập",
        isHide: checkRole(permissions),
        url: "/station/user",
      },
      {
        id: "/admin/manage-account/type-adminLocation",
        title: "Tạo bài tập",
        isHide: checkRole(permissions),
        url: "/station/data_station",
      },
    ],
  },
  {
    id: "/manage_account",
    title: "Hóa đơn",
    icon: <UserOutlined />,
    isHide: false,
    children: [
      {
        id: "manage_account/type_customer",
        title: "Thông tin đặt trạm",
        isHide: checkRole(permissions),
        url: "/station/user",
      },
    ],
  },
  {
    id: "/account",
    title: "Tài khoản",
    icon: <UserOutlined />,
    isHide: false,
    url: "/account",
  },
  {
    id: "/dashboard",
    title: "Hỗ trợ",
    icon: <UserOutlined />,
    isHide: false,
    url: "/dashboard",
  },
  {
    id: "/dashboard",
    title: "Thiết lập",
    icon: <UserOutlined />,
    isHide: false,
    url: "/dashboard",
  },
];

const MainLayout = () => {
  // const { authenticate, permissions, clearAuthenticate} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token_AirSENSE");
    const username = localStorage.getItem("username");
    if (!token || !username) navigate("/login");
  }, [
    localStorage.getItem("token_AirSENSE"),
    localStorage.getItem("username"),
  ]);

  return (
    <Layout style={{height:"100vh"}}>
      <Header className="header-customer">
        <HeaderCustomer />
      </Header>
      <Layout>
        <Sider width={215} className="site-layout-background" theme="light">
          <MenuBar menuList={MenuList("admin")} mode="inline" />
        </Sider>

        <Content className="customer-main-content">
          {/* <Breadcrumb style={{margin:"12px 20px"}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <ReBreadcrumb menuList={MenuList}></ReBreadcrumb>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
    // </Layout>
  );
};
export default MainLayout;
