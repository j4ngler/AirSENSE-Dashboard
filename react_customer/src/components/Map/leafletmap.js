import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import './Map.css';

let DefaultIcon = L.icon({
    iconUrl: markerIconPng,
});
L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap = () => {
    const position = [21.0057398, 105.8424833];

    return (
        <div>
            <MapContainer center={position} zoom={20} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <ZoomControl position='bottomright' />
                <Marker position={position}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default LeafletMap;



