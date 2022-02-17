import React, {useState,useContext } from 'react'
import { Row, Col, Card } from 'antd';
import locationInstallMarker from '../../../icon/locationInstallMarker.png';
import networkEquipMarker from '../../../icon/star.png';
import { 
  GoogleMap, 
  LoadScript,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
  useJsApiLoader,
  Polyline,
  Circle,
  InfoBox
} from '@react-google-maps/api';

import {
  MercuryContext
} from '../../../store/MercuryContext'

const SubTitleStyle ={
  color:'#656565',
  fontSize:13,  
}
const containerStyle = {
  height: '50vh', 
  width: '100%'
};

const installRadiusRedOption = {
  strokeColor: '#ff8888',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#ff8888',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 400,
  zIndex: 1
};
const installRadiusGreenOption = {
  strokeColor: '#88ff88',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#88ff88',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 200,//200,
  zIndex: 1
}

const MapInstall = () => {
  const {
    orderdetail, 
} = useContext(MercuryContext);
  console.log('Location',orderdetail)
  
  const { isLoaded } = useJsApiLoader({
    id : 'google-map-script',
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAP_KEY,
        version : process.env.REACT_APP_GOOGLE_MAP_VER
  })

  const [map, setMap] = React.useState(null)
  const [installLatLng, setInstallLagLng] = useState({lat: orderdetail.insAddr.lat, lng:  orderdetail.insAddr.lng});
  
  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  // console.log('defaultCenter.lat',center?)
  return (
    isLoaded ? (
      <Row style={{paddingBottom:'14px',paddingTop:'14px'}}>
        <label  style={SubTitleStyle}>ตำแหน่งสถานที่ติดตั้ง</label><br/>
        <GoogleMap
          mapContainerStyle={{height: '40vh',width: '100%'}}    
          center={installLatLng}
          // center={{ lat: Center.lat,lng:Center.lng}}
          // center={{lat:  Center.lat, lng: Center.lng}}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* <Marker
              position={center}              
          >
            
            <InfoWindow
            
                position={center}                
            >
                <div  style={{fontWeight: 'bold', padding: '4px'}}>Here </div>
            </InfoWindow>
          </Marker> */}
            <div>
                <Marker
                    infoWindowKey="installLocationMarker"
                    position={{ lat: Number(orderdetail.insAddr.lat), lng: Number(orderdetail.insAddr.lng) }}
                    icon={{
                        url: locationInstallMarker,
                        scaledSize: { width: 39, height: 48 }
                    }}
                    content="สถานที่ติดตั้ง"
                >
                </Marker>
                <Circle
                    center={installLatLng}
                    options={installRadiusRedOption}
                />
                <Circle
                    center={installLatLng}
                    options={installRadiusGreenOption}
                />
            </div>
            <Marker infoWindowKey="installLocationMarker"
            position={{ lat: Number(orderdetail.insNetwork.splfatLat), lng: Number(orderdetail.insNetwork.splfatLng) }}
              icon={{
                url: networkEquipMarker,
                scaledSize: { width: 39, height: 48 }
            }}
            >
              <InfoWindow
                position={{ lat: Number(orderdetail.insNetwork.splfatLat), lng: Number(orderdetail.insNetwork.splfatLng) }}                
              >
                <div  style={{fontWeight: 'bold', padding: '0px',}}>{orderdetail.insNetwork.splfatCode} </div>
              </InfoWindow>
            </Marker>
          <></>
        </GoogleMap>
        </Row>
    ) : <></>
  );
};

export default MapInstall;