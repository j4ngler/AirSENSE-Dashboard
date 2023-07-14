import { Form, Input, Select, Space } from "antd";
import React from "react";
import { ruleValidates } from "../../configs/constants";
import { useEffect } from "react";
import { httpPostData } from "../../features/API/httpBaseUtils";
import { useState } from "react";
import { API_URL } from "../../configs/config";

const SelectGroupContentSub = ({ initSubId }) => {
  const [contentGroups, setContentGroups] = useState();
  const [contentSubOptions, setContentSubOptions] = useState();
  const [contentSubs, setContentSubs] = useState();
  const [contentSub, setContentSub] = useState();
  const [contentGroup, setContentGroup] = useState();
  const [initialSubValue, setInitialSubValue] = useState()
  const [initialGroupValue, setInitialGroupValue] = useState()
  const [contentGroupOptions, setContentGroupOptions] = useState()

  const fetchInitial = async () => {
    const dataGroups = await httpPostData(API_URL + "customers/report", {
      table: "content_group",
    });
    const dataSubs = await httpPostData(API_URL + "customers/report", {
      table: "content_sub",
    });

    const contentSubFilter = dataSubs.data.result.find((dataSub) => initSubId === dataSub.content_sub_id)
    const contentGroupFilter = dataGroups.data.result.find((dataGroup) => contentSubFilter.content_group_id === dataGroup.content_group_id)
    let contentSubOptionData = []
    dataSubs.data.result.forEach(dataSub => {
      if (dataSub.content_group_id === contentGroupFilter.content_group_id) {
        contentSubOptionData = [...contentSubOptionData, {
          value: dataSub.content_sub_id,
          label: dataSub.title
        }
        ]
      }
    });
    setContentGroupOptions(dataGroups.data.result.map((item) => {
      return {
        value: item.content_group_id,
        label: item.title,
      };
    }))
    setContentSubOptions(contentSubOptionData)
    setInitialSubValue(initSubId)
    setInitialGroupValue(contentGroupFilter.content_group_id)
    setContentGroups(dataGroups.data.result);
    setContentSubs(dataSubs.data.result);
  };
  const onChangeGroup = (value) => {
    setInitialSubValue(1)
    setContentSubOptions(
      contentSubs
        .filter((item) => item.content_group_id === value)
        .map((item) => {
          return {
            value: item.content_sub_id,
            label: item.title,
          };
        })
    );
  };
  useEffect(() => {
    fetchInitial();
  }, []);
  return (
    <Space.Compact direction="vertical" block={true}>
      {initialGroupValue && <Form.Item
        name="content_group_id"
        label={"Chuyên mục (Menu)"}
        rules={[ruleValidates.requiredValue]}
        initialValue={initialGroupValue}
      >
        <Select
          placeholder="Please select"
          style={{
            width: "100%",
          }}
          onChange={onChangeGroup}
          options={contentGroupOptions}
        />
      </Form.Item>}
      {initialSubValue && <Form.Item
        name="content_sub_id"
        label={"Chuyên mục chi tiết"}
        rules={[ruleValidates.requiredValue]}
        initialValue={initialSubValue}
      >
        <Select
          placeholder="Please select"
          style={{
            width: "100%",
          }}
          options={contentSubOptions}
        />
      </Form.Item>}
    </Space.Compact >
  );
};

export default SelectGroupContentSub;
