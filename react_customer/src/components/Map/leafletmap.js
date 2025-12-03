import React, {useState, useEffect} from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { httpGetDataTable } from "../../features/API/httpBaseUtils";

const LeafletMap = () => {
    const position = [21.0057398, 105.8424833];
    const [dataMap, setDataMap] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await httpGetDataTable('device_sensor');
            setDataMap(data);
        }
        fetchData()
    }, [])

    return (
        <div>
            <MapContainer center={position} zoom={20} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <ZoomControl position='bottomright' />
                {dataMap.map((data,index) => {
                    return (
                        <Marker position={[data.latitude, data.longitude]} key={index}>
                            <Popup>
                                <p>
                                    {data.title}<br></br>
                                    {data.address}
                                </p>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}

export default LeafletMap;



