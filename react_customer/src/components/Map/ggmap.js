import React, { useCallback, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const position = {
  lat: 21.0057398,
  lng: 105.8424833
};

const GGMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.AIzaSyBdoJZBV7myj_2iPsIt3JM10Bkw39JXkaw,
  })

  // const [map, setMap] = useState();

  // const onLoad = useCallback(function callback(map) {
  //   // This is just an example of getting and using the map instance!!! don't just blindly copy!
  //   const bounds = new window.google.maps.LatLngBounds(position);
  //   map.fitBounds(bounds);

  //   setMap(map)
  // }, [])

  // const onUnmount = useCallback(function callback(map) {
  //   setMap()
  // }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
        // onLoad={onLoad}
        // onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <Marker position={position}/>
      </GoogleMap>
  ) : <div>Loading....</div>
}

export default GGMap;