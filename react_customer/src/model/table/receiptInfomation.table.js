import ButtonComponent from "../../components/Button";
import { ActionControl } from "../../utils/commonUtils";



class receiptInformation {
    getColumnShow = (callBack) => {
        const columns = [  
            {
              title: 'Order Id',
              dataIndex: 'order_id',
              key: '1',
              width: 60,
            },
            {
              title: 'Customer Id',
              dataIndex: 'customer_id',
              key: '2',
              width: 50,
            },
            {
              title: 'Creation time',
              dataIndex: 'created_at',
              key: '3',
              width: 50,
            },
            {
              title: 'Creation id',
              dataIndex: 'created_id',
              key: '4',
              width: 50,
            },
            {
              title: 'Update time',
              dataIndex: 'updated_at',
              key: '5',
              width: 150,
            },
            {
              title: 'Update id',
              dataIndex: 'updated_id',
              key: '6',
              width: 80,
            },
            {
              title: 'Action',
              key: '7',
              width: 100,
              render: () => (
                <div>
                    <ButtonComponent content={'View more'} size={'small'} handle={callBack(ActionControl.ACTION_VIEW)} />
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

export default receiptInformation;