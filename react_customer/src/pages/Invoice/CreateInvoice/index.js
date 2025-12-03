import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Select,
  Col,
  Row,
  InputNumber,
  notification,
} from "antd";
import ButtonComponent from "../../../components/Button";
import {} from "antd";
import { httpGetData, httpPostData } from "../../../features/API/httpBaseUtils";
import { MyCustomUploadAdapterPlugin } from "../../../features/API/uploadAdapter";
import { API_URL } from "../../../configs/config";
import { useNavigate } from "react-router-dom";
export default function CreateInvoice() {
  const navigate = useNavigate();
  const [services, setServices] = useState();
  const [service, setService] = useState();
  const [time, setTime] = useState(1);
  const [rentalTime, setRentalTime] = useState();
  const [serviceDetails, setServiceDetails] = useState();
  const [serviceDetail, setServiceDetail] = useState();
  const [contentHtml, setContentHtml] = useState();
  const [api, contextHolder] = notification.useNotification();
  const fetchIntial = async () => {
    const serviceGets = await httpGetData(
      API_URL + `service/available-service`,
      "service_collection"
    );
    console.log("serviceGets", serviceGets);
    setServices(serviceGets.data.result);
  };

  const serviceOptions =
    services &&
    services.map((item) => {
      return {
        value: item.service_collection_id,
        label: item.title,
      };
    });
  const serviceDetailOptions =
    serviceDetails &&
    serviceDetails.map((item) => {
      return {
        value: item[Object.entries(item)[0][0]],
        label: item.label,
      };
    });
  const timeOptions = [
    {
      value: "hour",
      label: "giờ",
    },
    {
      value: "day",
      label: "ngày",
    },
    {
      value: "week",
      label: "tuần",
    },
    {
      value: "month",
      label: "tháng",
    },
    {
      value: "year",
      label: "năm",
    },
  ];
  const onChangeService = async (value) => {
    setServiceDetails("");
    setServiceDetail("");
    let serviceChoose = services.filter(
      (item) => item.service_collection_id === value
    );
    if (value) {
      setService(value);
      const station = await httpGetData(
        API_URL + serviceChoose[0].url,
        "device_sensor"
      );
      setServiceDetails(station.data.result);
    }
  };
  const onChangeTime = (value) => {
    setTime(value);
  };
  const onChangeTimeUnit = (value) => {
    if (value === "hour") {
      setRentalTime(time);
    } else if (value === "day") {
      setRentalTime(time * 24);
    } else if (value === "week") {
      setRentalTime(time * 168);
    } else if (value === "month") {
      setRentalTime(time * 720);
    } else if (value === "year") {
      setRentalTime(time * 8760);
    }
  };
  const onChangeServiceDetail = (value) => {
    setServiceDetail(value);
  };
  const onChangeContent = (data) => {
    setContentHtml(data);
  };
  const onSubmit = async () => {
    if (!service || !rentalTime || !contentHtml) {
      api.warning({
        message: "Vui lòng điền đầy đủ các thông tin!",
        placement: "topRight",
      });
      return;
    }

    let dataSubmit = {
      service,
      rentalTime,
      contentHtml,
      serviceDetail,
    };
    await httpPostData(API_URL + "service/generate-order", dataSubmit).then(
      (result) => {
        if (result.status === 200) {
          navigate("/customer/result", {
            state: {
              status: "success",
              title: "Đặt dịch vụ thành công, hãy đợi admin xác nhận!",
              finishedBtn: "Quay về trang chủ",
              againBtn: "Tiếp tục đặt hàng",
            },
          });
        }
      }
    );
  };
  const configCK = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
  };
  useEffect(() => {
    fetchIntial();
  }, []);
  return (
    <>
      {contextHolder}

      <Col span={22} offset={1} className="news-container">
        <div className="title">
          <h1>Tạo hóa đơn</h1>
        </div>
        <Row>
          <Col span={10} offset={1}>
            <p>Danh mục (menu)</p>
            <Select
              size="large"
              placeholder="Please select"
              onChange={onChangeService}
              style={{
                width: "100%",
              }}
              options={serviceOptions}
              value={service}
            />
          </Col>
          <Col span={10} offset={2}>
            <p>Thời hạn</p>
            <Row>
              <InputNumber
                min={0}
                size="large"
                className="input-number"
                value={time}
                onChange={onChangeTime}
                style={{ marginRight: "5px" }}
              />
              <Select
                size="large"
                placeholder="Please select"
                onChange={onChangeTimeUnit}
                style={{
                  width: "50%",
                }}
                options={timeOptions}
                className="input-time-options"
              />
            </Row>
          </Col>
        </Row>
        {serviceDetails && (
          <Row>
            <Col span={10} offset={1}>
              <p>Danh sách chi tiết</p>
              <Select
                size="large"
                placeholder="Please select"
                onChange={onChangeServiceDetail}
                style={{
                  width: "100%",
                }}
                options={serviceDetailOptions}
                value={serviceDetail}
              />
            </Col>
          </Row>
        )}
        <br />
        <Row>
          <Col span={22} offset={1}>
            <h2>Ghi chú</h2>
            <div className={"document-editor"}>
              <div id="toolbar-container"></div>
              <CKEditor
                editor={ClassicEditor}
                data=""
                config={configCK}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  onChangeContent(data);
                  console.log({ event, editor, data });
                }}
                onBlur={(event, editor) => {
                  console.log("Blur.", editor);
                }}
                onFocus={(event, editor) => {
                  console.log("Focus.", editor);
                }}
              />
            </div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col offset={1}>
            <ButtonComponent content={"Tạo hóa đơn"} handle={onSubmit} />
          </Col>
        </Row>
      </Col>
    </>
  );
}
