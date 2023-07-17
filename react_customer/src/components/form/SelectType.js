import { Form, Select } from 'antd'
import React from 'react'
import { exportFieldSelectTable } from '../../model/manage.table'
import { httpGetDataTable, httpPostData } from '../../features/API/httpBaseUtils'
import { useEffect } from 'react'
import { API_URL } from '../../configs/config'
import { useState } from 'react'

const SelectType = ({ table, initialValue,variantInput }) => {
    const { main_id, main_info_title } = exportFieldSelectTable(table)
    const [typeOptions, setTypeOptions] = useState([])
    const fetchInitial = async () => {
        const data = await httpPostData(API_URL + "customers/report", {
            table,
        });
        const dataOptionFilter = data.data.result.map((item) => {
            return {
                value: item[main_id],
                label: item[main_info_title]
            }
        })
        setTypeOptions(dataOptionFilter)
    }
    // const handleChange = (value) => {

    // }
    useEffect(() => {
        fetchInitial()
    }, [])
    return (
        <Form.Item
            label={
                <span style={{ fontWeight: "bold" }}>{variantInput.view.title}</span>
            }
            name={variantInput.view.dataIndex}
            rules={variantInput.selectValidate}
            key={variantInput.view.dataIndex}
            initialValue={initialValue}
        >
            <Select
                placeholder="Please select"
                style={{
                    width: "100%",
                }}
                // onChange={handleChange}
                options={typeOptions}

            />
        </Form.Item>
    )
}

export default SelectType
