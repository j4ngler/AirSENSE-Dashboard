
export const PM10Threshold = {
    GOOD: 50,
    MODERATE: 100,
    UNHEALTHY_FOR_SENSITIVE: 250,
    UNHEALTHY: 350,
    VERY_UNHEALTHY: 430,
}
export const PM2p5Threshold = {
    GOOD: 30,
    MODERATE: 60,
    UNHEALTHY_FOR_SENSITIVE: 90,
    UNHEALTHY: 120,
    VERY_UNHEALTHY: 250,
}
export const NO2Threshold = {
    GOOD: 40,
    MODERATE: 80,
    UNHEALTHY_FOR_SENSITIVE: 180,
    UNHEALTHY: 280,
    VERY_UNHEALTHY: 400,
}
export const O3Threshold = {
    GOOD: 50,
    MODERATE: 100,
    UNHEALTHY_FOR_SENSITIVE: 168,
    UNHEALTHY: 208,
    VERY_UNHEALTHY: 748,
}
export const SO2Threshold = {
    GOOD: 40,
    MODERATE: 80,
    UNHEALTHY_FOR_SENSITIVE: 380,
    UNHEALTHY: 800,
    VERY_UNHEALTHY: 1600,
}
export const COThreshold = {
    GOOD: 1,
    MODERATE: 2,
    UNHEALTHY_FOR_SENSITIVE: 10,
    UNHEALTHY: 17,
    VERY_UNHEALTHY: 34,
}
export const PM1Threshold = {
    GOOD: 50,
    MODERATE: 100,
    UNHEALTHY_FOR_SENSITIVE: 250,
    UNHEALTHY: 350,
    VERY_UNHEALTHY: 430,
}
export const AQIThreshold = {
    GOOD: 50,
    MODERATE: 100,
    UNHEALTHY_FOR_SENSITIVE: 150,
    UNHEALTHY: 200,
    VERY_UNHEALTHY: 300,
}
export const AQIMessage = {
    GOOD: "Chất lượng không khí ở mức tốt",
    MODERATE: "Chất lượng không khí ở trung bình có thể chấp nhận được",
    UNHEALTHY_FOR_SENSITIVE: "Mức độ kém gây ảnh hưởng đến sức khỏe",
    UNHEALTHY: "Mức xấu, cần hạn chế ra ngoài đường khi không cần thiết",
    VERY_UNHEALTHY: "Mức rất xấu, cảnh báo gây nguy hiểm đến sức khỏe",
    HAZARDOUS: "Mức báo động, ảnh hưởng nghiêm trọng đến sức khỏe"
}
export const getTemperatureColor = (temperature) => {
    if (temperature <= 10) {
        return '#6495ED'; // Màu xanh dương cho nhiệt độ lạnh
    } else if (temperature <= 20) {
        return '#7FFF00'; // Màu xanh lá cây cho nhiệt độ mát mẻ
    } else if (temperature <= 30) {
        return '#FFD700'; // Màu vàng cho nhiệt độ ấm
    } else {
        return '#FF6347'; // Màu đỏ cho nhiệt độ nóng
    }
};
export const getAQIColor = (title, index) => {
    if (index > 0) {
        if (index <= title.GOOD) {
            return "#00e400"
        }
        else if (index < title.MODERATE) {
            return "#ffff00"
        }
        else if (index < title.UNHEALTHY_FOR_SENSITIVE) {
            return "#ff7e00"
        }
        else if (index < title.UNHEALTHY) {
            return "#ff0000"
        }
        else if (index < title.VERY_UNHEALTHY) {
            return "#99004c"
        }
        else {
            return "#7e0023"
        }
    }
    else {
        return ""
    }
}
export const getAQIMessage = (title, index) => {
    if (index > 0) {
        if (index <= title.GOOD) {
            return AQIMessage.GOOD
        }
        else if (index < title.MODERATE) {
            return AQIMessage.MODERATE
        }
        else if (index < title.UNHEALTHY_FOR_SENSITIVE) {
            return AQIMessage.UNHEALTHY_FOR_SENSITIVE
        }
        else if (index < title.UNHEALTHY) {
            return AQIMessage.UNHEALTHY
        }
        else if (index < title.VERY_UNHEALTHY) {
            return AQIMessage.VERY_UNHEALTHY
        }
        else {
            return AQIMessage.HAZARDOUS
        }
    }
    else {
        return ""
    }
}
export const getTemperatureMessage = (temperature) => {
    if (temperature <= 10) {
        return 'Nhiệt độ hiện tại rất thấp hãy mặc đầy đủ quần áo ấm để giữ ấm cơ thể';
    } else if (temperature <= 20) {
        return 'Thời tiết đang hơi se lạnh';
    } else if (temperature <= 30) {
        return 'Thời tiết hôm nay khá mát mẻ'; // Màu vàng cho nhiệt độ ấm
    } else {
        return 'Trời khá nóng'; // Màu đỏ cho nhiệt độ nóng
    }
}