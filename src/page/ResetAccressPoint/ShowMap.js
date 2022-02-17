import React from 'react';
import { Row, Col, Card } from 'antd';
import locationInstallMarker from '../../icon/locationInstallMarker.png'
import networkEquipMarker from '../../icon/networkEquipMarker.png';
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
const SubTitleStyle ={
  color:'#656565',
  fontSize:13,  
}
const containerStyle = {
  height: '50vh', 
  width: '100%'
};
const mapContainerStyle = {
    height: '70vh', 
    width: '100%'
};

const ShowMapPage = (props) => {
    console.log('props',props)
    const { isLoaded } = useJsApiLoader({
        id : 'google-map-script',
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAP_KEY,
        version : process.env.REACT_APP_GOOGLE_MAP_VER
    })

    const [map, setMap] = React.useState(props.latlng)

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])
    // console.log('defaultCenter.lat',Center)
    return (
        isLoaded ? (
        <Row style={{paddingBottom:'14px',paddingTop:'14px'}}>
            <label  style={SubTitleStyle}>ตำแหน่งสถานที่ติดตั้ง</label><br/>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}    
                center={props.latlng}
                // defaultCenter={props.latlng}
                mapTypeId="hybrid"
                zoom={17}
                // onLoad={onLoad}
                // onUnmount={onUnmount}
            >
            <Marker
                position={{ lat: Number(props.latlng.lat), lng: Number(props.latlng.lng) }}    
                icon={{
                    url: locationInstallMarker,
                    scaledSize: { width: 39, height: 48 }
                }}         
                content="สถานที่ติดตั้ง"
            >
                <div  style={{fontWeight: 'bold', padding: '4px'}}>สถานที่ติดตั้ง </div>
                {/* <InfoWindow
                    position={{ lat: Number(props.latlng.lat), lng: Number(props.latlng.lng) }}                
                >
                    <div  style={{fontWeight: 'bold', padding: '4px'}}>สถานที่ติดตั้ง </div>
                </InfoWindow> */}
            </Marker>
            <></>
            </GoogleMap>
            </Row>
        ) : <></>
    );
};

export default ShowMapPage;