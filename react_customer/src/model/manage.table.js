import deviceSensor from "./table/deviceSensor.table";
import groupContent from "./table/groupContent.table";
import groupContentSub from "./table/groupContentSub.table";
import pageContent from "./table/pageContent.table";
import order from "./table/order.table";




const classesFactory = {
    deviceSensor,
    groupContent,
    groupContentSub,
    pageContent,
    order
};

const classesFactoryMapping = {
    device_sensor: "deviceSensor",
    content_group: 'groupContent',
    content_sub: 'groupContentSub',
    page_content: 'pageContent',
    order: 'order'
};

export const exportColumnTable = (table, callback = null) => {
    let nameConverted = classesFactoryMapping[table];
    if(!!nameConverted) {
        let tableSelected = new classesFactory[nameConverted]();
        if(!!tableSelected) return tableSelected.getColumnShow(callback);
    }
    return [];
}

export const exportFieldToEdit = (table, callback = null) => {

}

export const exportFieldtoAdd = (table) => {

}

export const checkValidateValue = () => {

}