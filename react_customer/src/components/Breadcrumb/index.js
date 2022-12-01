import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import './breadcrumb.css';
import { URLMapping } from "../../configs/constants";

const ReBreadcrumb = (menuList, url) => {
    let location = useLocation();
    console.log(location);
    const address = location.pathname.split("/").slice(1);
    console.log(address);

    return (
        <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {address.map((addressItem) => 
                <Breadcrumb.Item>
                    <Link to={URLMapping[addressItem].url}>
                        {URLMapping[addressItem].title}
                    </Link>
                </Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

export default ReBreadcrumb;