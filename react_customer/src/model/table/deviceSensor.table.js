import ButtonComponent from "../../components/Button";
import { ActionControl } from "../../utils/commonUtils";

class deviceSensor {
    getColumnShow = (callBack) => {
        const columns = [
            {
              title: 'Station Name',
              width: 60,
              dataIndex: 'title',
              key: 'name',
              fixed: 'left',
            },        
            {
              title: 'Station ID',
              dataIndex: 'station_id',
              key: '1',
              width: 60,
            },
            {
              title: 'Longtitude',
              dataIndex: 'longtitude',
              key: '2',
              width: 50,
            },
            {
              title: 'Latitude',
              dataIndex: 'latitude',
              key: '3',
              width: 50,
            },
            {
              title: 'Owner',
              dataIndex: 'owner',
              key: '4',
              width: 50,
            },
            {
              title: 'Address',
              dataIndex: 'address',
              key: '5',
              width: 150,
            },
            {
              title: 'Status',
              dataIndex: 'type_sensor',
              key: '6',
              width: 80,
            },
            {
              title: 'Action',
              key: '7',
              width: 100,
              render: () => (
                <div>
                    {/* <ButtonComponent content={'Report'} size={'small'} handle={callBack(ActionControl.ACTION_REPORT)} />
                    <ButtonComponent content={'Edit'} size={'small'} handle={callBack(ActionControl.ACTION_UPDATE)} />
                    <ButtonComponent content={'Delete'} danger={true} size={'small'} handle={callBack(ActionControl.ACTION_DELETE)} /> */}
                </div>
              )
            }
            
          ];

        return columns;        
    }

    getInformationToEdit() {

    }

    getInformationToAdd() {

    }

    getHTMLToAdd () {

    }

    getTypeSelectToAdd() {

    }

    getColumnValidate() {

    }
}

export default deviceSensor;