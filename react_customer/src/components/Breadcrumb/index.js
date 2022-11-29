import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import './breadcrumb.css';
import routes from "../../configs/routes";

const URLMapping = {
    station: {
        title: "Quản lí trạm",
        url: "/manage_account"
    },
    data_station: {
        title: "Dữ liệu trạm",
        url: "/station/data_station"
    }
}
const ReBreadcrumb = (menuList, url) => {
    let location = useLocation();
    console.log(location);
    const adress = location.pathname.split("/").slice(1);
    console.log(adress);

    return (
        <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {adress.map((adressItem) => 
                <Breadcrumb.Item>
                    <Link to={URLMapping[adressItem].url}>
                        {URLMapping[adressItem].title}
                    </Link>
                </Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

export default ReBreadcrumb;