import React, { useState } from 'react';
import {HOST} from '../../config/config'
import './managerMap.css';

const StationMapManager = () => {
    const token = localStorage.getItem('token');
    console.log(token);
    const LinkToMap = 'http://'+HOST+'allStation/'+token;
    const LinktoReport = 'http://'+HOST+'reportstation/'+token;

    return (
        <>
        <div className='new-user-data'>
            <div className='report-map-block'>
            <a className='link-to-map' href={LinkToMap}>Hiển thị các trạm trên bản đồ</a>
            <a href={LinktoReport} className='link-to-report'>Trích xuất báo cáo trạm</a>
            </div>
            


    </div>
        </>
    )
}
export default StationMapManager;
