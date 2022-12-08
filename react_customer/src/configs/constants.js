const CONSTANT = {
    SUCCESS_CODE: 200,
    CREATED_CODE: 201,
    DELETED_CODE: 202,
    SERVER_ERROR_CODE: 500,
    BAD_REQUEST_CODE: 400,
    NOT_FOUND_CODE: 404,
    NOT_AUTHEN_CODE: 401,
    NOT_AUTHOR_CODE: 403,
};

export const APP_USER_TYPE = {
    CUSTOMER: 1,
    SUB_CUSTOMER: 2,
    RESEARCHER: 3
}

export const aqiToColor = (aqi) => {
    if (aqi <= 50) {
        return '#00e400';
    } else if (aqi <= 100) {
        return '#ffff00';
    } else if (aqi <= 150) {
        return '#ff7e00';
    } else if (aqi <= 200) {
        return '#ff0000';
    } else if (aqi <= 300) {
        return '#99004c';
    } else {
        return '#7e0023';
    }
};

export const URLMapping = {
    dashboard: {
        title: "Dashboard",
        url: "/dashboard"
    },
    newspaper: {
        title: "Bài báo",
        url: "/newspaper"
    },
    station: {
        title: "Quản lí trạm",
        url: "/manage_account"
    },
    data_station: {
        title: "Dữ liệu trạm",
        url: "/station/data_station"
    },
    list_station: {
        title: "Danh sách trạm",
        url: "/station/list_station"
    },
    user: {
        title: "Người dùng",
        url: "/station/user"
    },
    customer: {
        title: "Khách hàng",
        url: "/customer"
    }
    ,
    404: {
        title: "",
        url: "/customer/404"
    },
    account: {
        title: "Tài khoản",
        url: "/account"
    },
}

