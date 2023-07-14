import { Select } from 'antd'
import React from 'react'
import { exportFieldSelectTable } from '../../model/manage.table'
import { httpGetDataTable, httpPostData } from '../../features/API/httpBaseUtils'
import { useEffect } from 'react'
import { API_URL } from '../../configs/config'
import { useState } from 'react'

const SelectType = ({ table, initialValue }) => {
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
    const handleChange = () => {

    }
    useEffect(() => {
        fetchInitial()
    }, [])
    return (

        <Select
            placeholder="Please select"
            style={{
                width: "100%",
            }}
            // onChange={handleChange}
            options={typeOptions}
            defaultValue={initialValue}
        />
    )
}

export default SelectType
