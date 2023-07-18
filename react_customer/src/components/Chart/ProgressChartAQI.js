import React from 'react';
import { Progress } from 'antd';


const ProgressChartAQI = ({ value, renderColor, min, max, width, type }) => {
    // Tính toán giá trị phần trăm dựa trên chỉ số AQI
    const percent = (value / max) * 100;
    return (
        <Progress
            width={width}
            type={type}
            percent={percent}
            format={() => `${value}`}
            strokeColor={renderColor(value)}
        />
    );
};

export default ProgressChartAQI;
