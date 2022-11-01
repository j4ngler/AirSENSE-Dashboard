import * as React from 'react';
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import ExtensionIcon from '@material-ui/icons/Extension';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import ClassIcon from '@material-ui/icons/Class';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import BuildIcon from '@material-ui/icons/Build';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import DetailsIcon from '@material-ui/icons/Details';
import {
  Comment,
  Settings,
  Send,
  Contacts,
  FeaturedPlayList,
  KeyboardBackspace,
  TextFormat,
  Business,
  GroupWork,
  DynamicFeed,
} from '@material-ui/icons';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Admin, Resource, ListGuesser, Layout } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { configureStore } from '@reduxjs/toolkit';
import { PostList, PostEdit, PostCreate, PostShow } from './posts';
import UserList from './container/manager/users.js';
import PagesContent from './container/manager/PagesContent.js';
import RegisterPage from './container/manager/RegisterPage.js';
import AdvertisementPage from './container/manager/AdvertisementPage.js';
import PagesCourse from './container/manager/PagesCourse';
import RegisterCourse from './container/manager/RegisterCourse';
import ExamDetail from './container/manager/ExamDetail';
import RegisterExam from './container/manager/RegisterExam';
import LockScreen from './container/manager/LockScreen.js';
import NomalTable from './container/manager/NomalTable.js';
import UserTable from './container/manager/UserTable.js';
import LogoutPage from './container/authen/LogoutPage.js';
import ChatBoxInternal from './container/message/ChatBoxInternal.js';
import FormChatBox from './compoment/chat/chatbox.js';
import DialogChat from './container/message/DialogChat';
import FooterChat from './container/message/FooterChat';
import './styles/style.css';
import Dashboard from './container/manager/Dashboard';
import authProvider from './api/authProvider';
import { HOST_HTTP } from './config/config.js';
import TreeMenu from '@bb-tech/ra-treemenu';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import messageInfo from './reducers/index';
import MenuHeader from './container/head/menuHeader';
import LoginPage from './container/authen/LoginPage';
import InfoAccount from './container/authen/account';
import Header from './compoment/header/header.js';
import StationMapManager from './container/station_map/stationMapManager';
const App = () => {
  return (
    <div>
      <Admin
        dataProvider={jsonServerProvider(HOST_HTTP)}
        authProvider={authProvider}
        loginPage={LoginPage}
        dashboard={Dashboard}
        customReducers={{ messageInfo }}
        layout={(props) => (
          <Layout {...props} menu={TreeMenu} appBar={MenuHeader} />
        )}
      >
         <Resource
          name="user"
          options={{ label: 'Tài khoản' }}
          icon={UserIcon}
          list={UserList}
        />
        <Resource
          name="customer"
          options={{ label: 'Khách hàng' }}
          icon={TextFormat}
          list={NomalTable}
        />
        <Resource
          name="sPages"
          options={{ label: 'Nhóm bài báo', isMenuParent: true }}
          icon={DynamicFeed}
          list={LockScreen}
        />
        <Resource
          name="content_sub"
          options={{ label: 'Nhóm bài báo', menuParent: 'sPages' }}
          icon={FeaturedPlayList}
          list={NomalTable}
        />
        <Resource
          name="managerpages"
          options={{ label: 'Quản lý bài báo', menuParent: 'sPages' }}
          icon={Settings}
          list={PagesContent}
        />
        <Resource
          name="registerPage"
          options={{ label: 'Viết bài', menuParent: 'sPages' }}
          icon={TextFormat}
          list={RegisterPage}
        />
        
        <Resource
          name="service_x"
          options={{ label: 'Trạm', isMenuParent: true }}
          icon={RoomServiceIcon}
          list={LockScreen}
        />
        <Resource
          name="sparc_group_location_sensor"
          options={{ label: 'Nhóm vị trí', menuParent: 'service_x' }}
          icon={AttachMoneyIcon}
          list={NomalTable}
        />
        <Resource
          name="device_sensor"
          options={{ label: 'Vị trí của sensor', menuParent: 'service_x' }}
          icon={KeyboardReturnIcon}
          list={NomalTable}
        />
        <Resource
          name="station_map"
          options={{
            label: 'Quản lí trạm trên bản đồ',
            menuParent: 'service_x',
          }}
          icon={KeyboardReturnIcon}
          list={StationMapManager}
        />

        <Resource
          name="products"
          options={{ label: 'sensor', isMenuParent: true }}
          icon={ShoppingCartIcon}
          list={LockScreen}
        />
        <Resource
          name="sparc_aqi"
          options={{ label: 'AQI', menuParent: 'products' }}
          icon={KeyboardReturnIcon}
          list={NomalTable}
        />
        <Resource
          name="extended_data"
          options={{ label: 'Mỏ rộng', menuParent: 'products' }}
          icon={ShoppingCartIcon}
          list={NomalTable}
        />
        <Resource
          name="sparc_sensor_data"
          options={{ label: 'Dữ liệu sensor', menuParent: 'products' }}
          icon={ReceiptIcon}
          list={NomalTable}
        />
        <Resource
          name="sparc_sensor_max_min"
          options={{ label: 'Cài đặt MaxMin', menuParent: 'products' }}
          icon={HighlightOffIcon}
          list={NomalTable}
        />
        <Resource
          name="sparc_sensor_warning"
          options={{ label: 'warning', menuParent: 'products' }}
          icon={DetailsIcon}
          list={NomalTable}
        />

        <Resource
          name="infoUser"
          options={{ label: 'Thông tin tài khoản' }}
          icon={AccountCircleIcon}
          list={InfoAccount}
        />
        <Resource
          name="logout"
          options={{ label: 'Đăng xuất' }}
          icon={KeyboardBackspace}
          list={LogoutPage}
        /> 

      </Admin>
    </div>
  );
};
export default App;
