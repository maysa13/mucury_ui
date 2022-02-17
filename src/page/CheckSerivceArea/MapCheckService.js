/* global google */
import React, {forwardRef, useRef, useImperativeHandle, useEffect, useState, useCallback, useReducer } from 'react'

/* Plugin */
import { 
    GoogleMap,
    Marker,
    InfoWindow,
    useJsApiLoader,
    Polyline,
    Circle,
    OverlayView
 } from '@react-google-maps/api';
 import {message} from 'antd';

/* Helper */
import { isNotError } from '../../helper/UtilityFunction';

/* Icon */
import { ReactComponent as WarnIcon } from '../../icon/warn.svg'
import {
    CloseCircleFilled
} from '@ant-design/icons';

 /* Marker */
import locationInstallMarker from '../../icon/locationInstallMarker.png';
import networkEquipMarker from '../../icon/networkEquipMarker.png';

/* API */
import MercuryAPI from '../../api/MercuryAPI';

const mapContainerStyle = {
    height: '100%', 
    width: '100%'
};

const strokeColorList = [
    '#48bcff',
    '#ffb348',
    '#ff5748'
];  

const mercuryAPI = new MercuryAPI();  

const MapCheckService = forwardRef((props, ref) => {
    const [map, setMap] = useState(null);
    const [isMapFullScreen, setIsMapFullScreen] = useState(false);
    const [circuitList, setCircuitList] = useState([]);
    const [distanceInstallPlaceAndEquipment,setDistanceInstallPlaceAndEquipment] = useState(0);
    const [clickAddLatLngToPathListener,setClickAddLatLngToPathListener] = useState();
    const [inBetween ,setInBetween] = useState(null);
    const [infoWindowForUserDrawPolylineOpen, setInfoWindowForUserDrawPolylineOpen] = useState(true);
    const [openInfoWindowKey, setOpenInfoWindowKey] = useState('');
    const [infoWindowOpen, setInfoWindowOpen] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState(null);
    let areadySelectedMarker = false;
    const [markerMap, setMarkerMap] = useState({});
    const [directionsState, setDirectionsState] = useState(null);
    const [coordsState, setCoordsState] = useState(null);
    const [routeInstallPlaceAndEquipmentList, setRouteInstallPlaceAndEquipmentList] = useState([]);
    const [pathInstallPlaceAndEquipmentList, setPathInstallPlaceAndEquipmentList] = useState([]);
    const [pathUserDraw,setPathUserDraw] = useState([]);
    const [undoTrigger,setUndoTrigger] = useState(false);
    const [boundsValue, setBoundsValue] = useState();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let autoComplete;
    const [query, setQuery] = useState("");
    const autoCompletePlaceRef2 = useRef(null);
    const divAutoCompletePlaceRef = useRef(null);


    const markerLoadHandler = (marker) => {
        return setMarkerMap(prevState => {
          console.log("markerLoadHandler => markerMap.index : ",marker.index);  
          console.log("setMarkerMap : ",{ ...prevState, [marker.index]: marker })
          return { ...prevState, [marker.index]: marker };
        });
    };

    const [installLatLng, setInstallLagLng] = useState({lat: null, lng: null});
    const [placeSelectedLatLng, setPlaceSelectLatLng] = useState({lat: null, lng: null});

    const { isLoaded } = useJsApiLoader({
        id : 'google-map-script',
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAP_KEY,
        version : process.env.REACT_APP_GOOGLE_MAP_VER
      })

    const onClickMarker = (markerData) => event => {
        console.log("onClickMarker ==> markerData : ",markerData);
        setSelectedMarker(markerData);
        props.updateSelectedMarker(markerData);
        areadySelectedMarker = true;

        //setOpenInfoWindowKey(infoWindowKey)
        setInfoWindowOpen(true);

    }

    const manualClickMarker = (markerData) => {
        console.log("manualClickMarker ==> markerData : ",markerData);
        setSelectedMarker(markerData);
        areadySelectedMarker = true;
        setInfoWindowOpen(true);
    }

    const onClickCloseInforWindow = () => event => {
        //setOpenInfoWindowKey('')
        setInfoWindowOpen(false);
    }

    const animationEquipmentNetworkMarker = (markerData) => {
        if(selectedMarker){
            if(selectedMarker.index === markerData.index){
                return 1;
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    }

    const onClickCloseInforWindowForUserDrawPolyline = () =>  event => {
        setInfoWindowForUserDrawPolylineOpen(false);
    }

    const onClickPlaceSelectedMarker = (markerData) => event => {
        setInstallLagLng({lat: markerData.lat, lng: markerData.lng}); 
    }

    const [activeMarker, setActiveMarker] = useState(null);

    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
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
        radius: 200,
        zIndex: 1
    }

    // const showMessageClickNetworkMarker = () => {
    //     console.log("areadySelectedMarker : ",areadySelectedMarker);
    //     if(areadySelectedMarker === false){
    //         message.info({
    //             content: 'คลิกที่ไอคอนอุปกรณ์บนแผนที่เพื่อเลือกอุปกรณ์'
    //         });
    //     }
    // }


    function addEventClickPinInstallMarker(map) {
        window.google.maps.event.addListener(map, 'click',(event) => {
            setInstallLagLng({lat: event.latLng.lat(), lng: event.latLng.lng()}); 
            //showMessageClickNetworkMarker();
        })
    }

    function processDirectionToEquipment (installLat, installLng, equipmentList)  {
        console.log("Processing requests");

        //for test start------------------------------------------------------------------------------------------------------------------------------------
        let tempCircuitList = equipmentList;
        //for test end------------------------------------------------------------------------------------------------------------------------------------

        //clear เส้นทางระยะข่ายสาย
        setPathInstallPlaceAndEquipmentList([]);

        const directionsService = new window.google.maps.DirectionsService();
        const origin = { lat: parseFloat(installLat), lng: parseFloat(installLng) };

        //Counter to track request submission;
        let current = 0;
        submitRequest();
        function submitRequest(){
            const destination = { lat: parseFloat(equipmentList[current].splfatLat), lng: parseFloat(equipmentList[current].splfatLng)};
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                }, 
                directionResults
            );
        }

        function directionResults(result, status) {
            //console.log("Receiving request for route: ", current);
            console.log("result : ",result)
            console.log("status : ",status);
            if (status === window.google.maps.DirectionsStatus.OK) {
                //console.log("result : ",result)
                // result.routes[0].overview_path.forEach(element => {
                //     console.log("element.lat() : ",element.lat());
                //     console.log("element.lng() : ",element.lng());
                // });

                //ข้อมูล route ทั้งหมด
                // const newRoute = result.routes[0];
                // setRouteInstallPlaceAndEquipmentList(prevArray => [...prevArray, newRoute])

                //ข้อมูล distance
                //for pro start------------------------------------------------------------------------------------------------------------------------------------
                //let tempCircuitList = equipmentList;
                //for pro end------------------------------------------------------------------------------------------------------------------------------------
                tempCircuitList[current].distance = (result.routes[0].legs[0].distance.value * 1.1).toFixed(2);
                setCircuitList(tempCircuitList);
                props.updateCircuitListData(tempCircuitList);
                 
                //ข้อมูล path อย่างเดียว
                if(tempCircuitList[current].distance <= 500){
                    const newPath = result.routes[0].overview_path;
                    setPathInstallPlaceAndEquipmentList(prevArray => [...prevArray, newPath])
                }
            } else {
                console.error(`error fetching directions ${result}`);
            }
            nextRequest();
        }
        
        function nextRequest(){
            current++;
            if(current >= equipmentList.length){
                //console.log("Done");
                //for test start------------------------------------------------------------------------------------------------------------------------------------
                tempCircuitList.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                setCircuitList(tempCircuitList);
                props.updateCircuitListData(tempCircuitList);
                //for test end--------------------------------------------------------------------------------------------------------------------------------------
                return;
            }
            submitRequest();
        }
    }

    function StartDrawPolylineControl(controlDiv, map) {
        // Set CSS for the control
        const controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#E34625";
        //controlUI.style.border = "2px solid #fff";
        controlUI.style.borderRadius = "3px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginBottom = "10px";
        controlUI.style.marginLeft = "10px";
        controlUI.style.textAlign = "center";
        controlUI.title = "วัดระยะข่ายสายไปยังจุดติดตั้ง";
        controlDiv.appendChild(controlUI);
      
        // Set CSS for the control interior
        const controlText = document.createElement("div");
        controlText.style.color = "#fff";
        //controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "40px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "วัดระยะข่ายสายไปยังจุดติดตั้ง";
        controlUI.appendChild(controlText);
      
        controlUI.addEventListener("click", () => {
            map.setOptions({draggableCursor:'cell'});
            window.google.maps.event.clearListeners(map,'click');
            window.google.maps.event.addListener(map, 'click',(event) => {
                addLatLngToPath(event.latLng);
                setInfoWindowForUserDrawPolylineOpen(true);
            });

            //ลบ button วัดระยะข่ายสายไปยังจุดติดตั้ง
            map.controls[google.maps.ControlPosition.LEFT_CENTER].removeAt(0);

            //สร้าง button หยุดวัดระยะข่ายสายไปยังจุดติดตั้ง
            setFinishDrawButtonToMap(map)

            message.info({
                content: 'คลิกบนแผนที่เพื่อวาดเส้นทางข่ายสายจากสถานที่ติดตั้งไปยังอุปกรณ์'
            });


        });

        
    }

    function FinishDrawPolylineControl(controlDiv, map) {
        // Set CSS for the control border
        const controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#686868";
        //controlUI.style.border = "2px solid #fff";
        //controlUI.style.border = "2px solid rgba(0,0,0,0.2)";
        controlUI.style.borderRadius = "3px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginBottom = "10px";
        controlUI.style.marginLeft = "10px";
        controlUI.style.textAlign = "center";
        controlUI.title = "หยุดวัดระยะข่ายสายไปยังจุดติดตั้ง";
        controlDiv.appendChild(controlUI);
      
        // Set CSS for the control interior
        const controlText = document.createElement("div");
        controlText.style.color = "#fff";
        //controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "40px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "หยุดวัดระยะข่ายสายไปยังจุดติดตั้ง";
        controlUI.appendChild(controlText);
      
        controlUI.addEventListener("click", () => {
            map.setOptions({draggableCursor:''});
    
            window.google.maps.event.clearListeners(map,'click');
            addEventClickPinInstallMarker(map);

            //ลบ button หยุดวัดระยะข่ายสายไปยังจุดติดตั้ง
            map.controls[google.maps.ControlPosition.LEFT_CENTER].removeAt(0);

            //สร้าง button วัดระยะข่ายสายไปยังจุดติดตั้ง
            setStartDrawButtonToMap(map)

            // console.log("map.controls[window.google.maps.ControlPosition.LEFT_CENTER] : ",map.controls[window.google.maps.ControlPosition.LEFT_CENTER])
            // map.controls[window.google.maps.ControlPosition.LEFT_CENTER].forEach(function(element, index) {
            //     console.log("index : ",index, " element : ",element)
            // });
        });

        
    }

    function ClearDrawPolylineControl(controlDiv, map) {
        // Set CSS for the control border
        const controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#686868";
        //controlUI.style.border = "2px solid #fff";
        //controlUI.style.border = "2px solid rgba(0,0,0,0.2)";
        controlUI.style.borderRadius = "3px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginBottom = "10px";
        controlUI.style.marginRight = "10px";
        controlUI.style.textAlign = "center";
        controlUI.title = "ลบเส้นทางระยะข่ายสายที่วาด";
        controlDiv.appendChild(controlUI);
      
        // Set CSS for the control interior
        const controlText = document.createElement("div");
        controlText.style.color = "#fff";
        //controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "40px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "ลบเส้นทางระยะข่ายสายที่วาด";
        controlUI.appendChild(controlText);
      
        controlUI.addEventListener("click", () => {
            setPathUserDraw([]);
        });

        
    }

    function UndoDrawPolylineControl(controlDiv, map) {
        // Set CSS for the control border
        const controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#686868";
        //controlUI.style.border = "2px solid #fff";
        //controlUI.style.border = "2px solid rgba(0,0,0,0.2)";
        controlUI.style.borderRadius = "3px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginBottom = "10px";
        controlUI.style.textAlign = "center";
        controlUI.title = "ย้อนกลับ";
        controlDiv.appendChild(controlUI);
      
        // Set CSS for the control interior
        const controlText = document.createElement("div");
        controlText.style.color = "#fff";
        //controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "40px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = "ย้อนกลับ";
        controlUI.appendChild(controlText);
      
        controlUI.addEventListener("click", () => {
            undoLatLngToPath();
        });

        
    }

    

    function  addLatLngToPath(latLng) {  
        const newPathLatLng = latLng;
        setPathUserDraw(prevArray => [...prevArray, newPathLatLng]);
    } 

    function undoLatLngToPath(){
        setUndoTrigger((undoTrigger) => {
            return !undoTrigger;
        });     
    }

    function setStartDrawButtonToMap(map) {
        const startDrawPolylineControlDiv = document.createElement("div");
        StartDrawPolylineControl(startDrawPolylineControlDiv, map);
        map.controls[window.google.maps.ControlPosition.LEFT_CENTER].push(startDrawPolylineControlDiv);
    }

    function setFinishDrawButtonToMap(map) {
        const finishDrawPolylineControlDiv = document.createElement("div");
        FinishDrawPolylineControl(finishDrawPolylineControlDiv, map);
        map.controls[window.google.maps.ControlPosition.LEFT_CENTER].push(finishDrawPolylineControlDiv);
    } 

    function setClearDrawButtonToMap(map) {
        const clearDrawPolylineControlDiv = document.createElement("div");
        ClearDrawPolylineControl(clearDrawPolylineControlDiv, map);
        map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(clearDrawPolylineControlDiv);
    }

    function setUndoDrawButtonToMap(map) {
        const undoDrawPolylineControlDiv = document.createElement("div");
        UndoDrawPolylineControl(undoDrawPolylineControlDiv, map);
        map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(undoDrawPolylineControlDiv);
    }

    function onBoundsChanged(map) {
        if (
          map.getDiv().firstChild.clientHeight === window.innerHeight &&
          map.getDiv().firstChild.clientWidth === window.innerWidth
        ) {
          console.log('FULL SCREEN');
          setIsMapFullScreen(true);
        } else {
          console.log('NOT FULL SCREEN');
          setIsMapFullScreen(false);
        }
    }

    function addEventOnBoundsChanged(map) {
        window.google.maps.event.addListener(map, 'bounds_changed',(event) => {
            onBoundsChanged(map);
        });
    }

    function setAutoCompletePlaceBoxToMap(map) {
        handleScriptLoad(setQuery,map)
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(divAutoCompletePlaceRef.current);  
    }

    const onLoadMap = useCallback(function callback(map) {
        // window.google.maps.event.addListener(map, 'bounds_changed',(event) => {
        //     onBoundsChanged(map);
        // });
        addEventOnBoundsChanged(map);

        // handleScriptLoad(setQuery,map)
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(divAutoCompletePlaceRef.current);
        setAutoCompletePlaceBoxToMap(map); 
        addEventClickPinInstallMarker(map);
        setStartDrawButtonToMap(map);
        setClearDrawButtonToMap(map);
        setUndoDrawButtonToMap(map);
        setMap(map);
    }, [])

    document.onfullscreenchange = function ( event ) {
        let target = event.target;
        let pacContainerElements = document.getElementsByClassName("pac-container");
        console.log("pacContainerElements : ",pacContainerElements);
        console.log("document.getElementsByClassName('pac-container')[0].parentElement : ",document.getElementsByClassName("pac-container")[0].parentElement);
        console.log("target : ",target);
        if(pacContainerElements.length > 0) {
            let pacContainer1 = document.getElementsByClassName("pac-container")[0];
            let pacContainer2 = document.getElementsByClassName("pac-container")[1];
            if (pacContainer1.parentElement === target) {
            //if(isMapFullScrreen === false){    
                console.log("Exiting FULL SCREEN - moving pacContainer to body");
                document.getElementsByTagName("body")[0].appendChild(pacContainer2);
            } else {
                console.log("Entering FULL SCREEN - moving pacContainer to target element");
                target.appendChild(pacContainer2);
            }
        } else {
            console.log("FULL SCREEN change - no pacContainer found");
         }
    };   

    const handleScriptLoad = (updateQuery,map) => {
        // Declare Options For Autocomplete
        const options = {
          types: ['establishment'],
          componentRestrictions: { country: "th" }
        };
    
        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        autoComplete = new window.google.maps.places.Autocomplete(
            autoCompletePlaceRef2.current,
          options,
        );
    
        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components and formatted
        // address.
        //autoComplete.setFields(['address_components', 'formatted_address']);
        autoComplete.setFields(['name', 'geometry']);
    
        // Fire Event when a suggested name is selected
        autoComplete.addListener('place_changed', () => 
            handlePlaceSelect(updateQuery,map)
        );

        enableEnterKey(autoCompletePlaceRef2.current);
    }

    async function handlePlaceSelect(updateQuery,map) {
        const addressObject = autoComplete.getPlace()
        const query = addressObject.name;
        setQuery(query);
        forceUpdate();
        if(addressObject.geometry){
            //setShowMap(true);
            // mapRef.current.setMapCenter(addressObject.geometry.location);
            // mapRef.current.setMapZoom(17);
            // mapRef.current.setPlaceSelectMarker(addressObject.geometry.location.lat(), addressObject.geometry.location.lng())
            map.setCenter(addressObject.geometry.location);
            map.setZoom(17);
            setPlaceSelectLatLng({lat : addressObject.geometry.location.lat(), lng : addressObject.geometry.location.lng()});

        }
    }

    function enableEnterKey(input) {

        /* Store original event listener */
        const _addEventListener = input.addEventListener
    
        const addEventListenerWrapper = (type, listener) => {
          if (type === 'keydown') {
            /* Store existing listener function */
            const _listener = listener
            listener = (event) => {
              /* Simulate a 'down arrow' keypress if no address has been selected */
              const suggestionSelected = document.getElementsByClassName('pac-item-selected').length
              if (event.key === 'Enter' && !suggestionSelected) {
                const e = new KeyboardEvent('keydown', { 
                  key: 'ArrowDown', 
                  code: 'ArrowDown', 
                  keyCode: 40, 
                })
                _listener.apply(input, [e])
              }
              _listener.apply(input, [event])
            }
          }
          _addEventListener.apply(input, [type, listener])
        }
    
        input.addEventListener = addEventListenerWrapper
    }

    const clickClearPalceSearch = () => (event) => {
        setQuery("");
        setPlaceSelectLatLng('','')
    }

    const onUnmountMap = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const onLoadUserDrawPolyline = useCallback(function callback(polyline) {
        window.google.maps.event.addListener(polyline, 'click', function(event) {
            setInfoWindowForUserDrawPolylineOpen(true);
        });
        //setPolyUserDraw(polyline);
    }, [])


    useImperativeHandle(ref, () => ({

        setMapCenter(latLng) {
            console.log("setMapCenter => latLng.lat(),latLng.lng() : ",latLng.lat(),latLng.lng());
            map.setCenter(latLng);
        },

        setMapZoom(zoomLevel) {
            console.log("setMapZoom => zoomLevel : ",zoomLevel);
            map.setZoom(zoomLevel);
        },

        setInstallMarker(lat,lng){
            console.log("setInstallMarker => lat : ",lat," lng : ",lng);
            setInstallLagLng({lat: lat,lng: lng})
        },

        setPlaceSelectMarker(lat,lng){
            console.log("ssetPlaceSelectMarker => lat : ",lat," lng : ",lng);
            setPlaceSelectLatLng({lat: lat,lng: lng})
        },

        setManualClickMarker(markerData){
            console.log("setManualClickMarker => markerData : ",markerData)
            manualClickMarker(markerData);
        }
    
    }));
    
    // useEffect(() => {
    //     if(installLatLng.lat && installLatLng.lng){
    //         props.setInstallLatLng(installLatLng.lat  ,installLatLng.lng);
    //     }
        
        
    // }, [installLatLng])

    useEffect(() => {
        console.log("พิกัดเส้นทาง วาดเอง => pathUserDraw : ",pathUserDraw);
        if(pathUserDraw.length > 1){
            console.log("เส้นทางระยะข่ายสาย วาดเอง => window.google.maps.geometry.spherical.computeLength(pathUserDraw).toFixed() : ",window.google.maps.geometry.spherical.computeLength(pathUserDraw).toFixed() , "เมตร")
            setDistanceInstallPlaceAndEquipment(window.google.maps.geometry.spherical.computeLength(pathUserDraw).toFixed()); //เมตร
            setInBetween(window.google.maps.geometry.spherical.interpolate(pathUserDraw[pathUserDraw.length -2], pathUserDraw[pathUserDraw.length -1], 0.5));  
        }
    }, [pathUserDraw])

    useEffect(() => {
        console.log("🚀 ~ file: MapCheckService.js ~ line 503 ~ useEffect ~ undoTrigger", undoTrigger)
        let array  = [...pathUserDraw]
        array.pop()
        setPathUserDraw(array);
    }, [undoTrigger])

    useEffect(() => {
        if(installLatLng.lat && installLatLng.lng){
            props.updateSelectedMarker(null);
            mercuryAPI.searchCircuit(installLatLng.lat, installLatLng.lng).then(data => {
                if (isNotError(data)) {
                    if(data.length > 0){
                        console.log("searchc => data :",data);

                        props.updateHaveCircuitListFromMap(true);
   
                        //for test start----------------------------------------------------------------------------------------------------------------------------------
                        let testData = data;
                        let testDataWithDistance = data;
                        //let timeout = 0;
                        for(let i = 0; i < testData.length;i++){
                            testData[i].index = i.toString(); 

                            // let origin = new google.maps.LatLng(installLatLng.lat, installLatLng.lng);
                            // let destination = new google.maps.LatLng(testData[i].splfatLat, testData[i].splfatLng);
                            // let service = new google.maps.DistanceMatrixService();
                            // timeout = timeout+150;
                            // setTimeout(function () {
                            //     service.getDistanceMatrix(
                            //         {
                            //             origins: [origin],
                            //             destinations: [destination],
                            //             travelMode: 'DRIVING',
                            //             unitSystem: google.maps.UnitSystem.METRIC,
                            //             avoidHighways: true,
                            //             avoidTolls: true,
                            //         },(response, status) => {
                            //             console.log("response data "+testData[i].splfatLat+", "+testData[i].splfatLng, response);
                            //             console.log("status: ", status);
                            //             testDataWithDistance[i].distance = response.rows[0].elements[0].distance.value;
                            //         });  
                            // }, timeout);

                            testDataWithDistance[i].distance = google.maps.geometry.spherical.computeDistanceBetween (
                                new google.maps.LatLng(installLatLng.lat, installLatLng.lng), 
                                new google.maps.LatLng(testData[i].splfatLat, testData[i].splfatLng)
                            );
                        
                        }
                        console.log("testDataWithDistance : ",testDataWithDistance);
                        testDataWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                        console.log("sort => testDataWithDistance : ",testDataWithDistance);
                        let dataWithDistance = testDataWithDistance.slice (0, 3);
                        

                        setCircuitList(dataWithDistance);
                        props.updateCircuitListData(dataWithDistance);
                        //เริ่มการวาดเส้นทางระยะข่ายสาย Auto
                        processDirectionToEquipment(installLatLng.lat, installLatLng.lng, dataWithDistance);
                        //for test end----------------------------------------------------------------------------------------------------------------------------------

                        // for pro
                        // setCircuitList(data);
                        // props.updateCircuitListData(data);
                        // //เริ่มการวาดเส้นทางระยะข่ายสาย Auto
                        // processDirectionToEquipment(installLatLng.lat, installLatLng.lng, data);
                    }
                    else{
                        props.updateHaveCircuitListFromMap(false);
                        setCircuitList([]);
                        props.updateCircuitListData([]);
                    }
                    
                }
            });
            
            //เริ่มการวาดเส้นทางระยะข่ายสาย Auto
            //processDirectionToEquipment(installLatLng.lat, installLatLng.lng, props.documentWorkData.workDetl[0].file)

            props.setInstallLatLng(installLatLng.lat  ,installLatLng.lng);
        }
    }, [installLatLng])

    useEffect(() => {
        setQuery(props.autoCompleteQueryFromStep1)
    }, [props.autoCompleteQueryFromStep1])

    useEffect(() => {
        props.updateAutoCompleteQueryFromMap(query);
    }, [query])
    

    const searchBoxRef = useRef();

    //const onLoad = ref => this.searchBox = ref;

    const onPlacesChanged = () => console.log(this.searchBox.getPlaces());

 
    return ( isLoaded ? (
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={17}
                mapTypeId="hybrid"
                onLoad={onLoadMap}
                onUnmount={onUnmountMap}
            >

                {/* Marker ข่ายสาย */}
                {(installLatLng.lat && installLatLng.lng) && circuitList.map(function (itemCircuit, indexCircuit){
                    return(
                            <div key={`circuit${indexCircuit}`}>
                                {
                                    itemCircuit.splfatLat && itemCircuit.splfatLng && itemCircuit.distance <= 500 &&
                                    <Marker
                                        infoWindowKey={`circuit${indexCircuit}`}
                                        position={{ lat: Number(itemCircuit.splfatLat), lng: Number(itemCircuit.splfatLng) }}
                                        icon={{
                                            url: networkEquipMarker,
                                            scaledSize: { width: 39, height: 48 }
                                        }}
                                        onClick={onClickMarker(itemCircuit)}
                                        content={`FT002 [ว่าง 12/16]`}
                                        onLoad={marker => markerLoadHandler(marker, indexCircuit)}
                                        animation={animationEquipmentNetworkMarker(itemCircuit)}
                                    >
                                        {/* {(String(openInfoWindowKey) ===  String(itemCircuit.id)) && */}
                                        {infoWindowOpen &&
                                            <InfoWindow
                                                options={{disableAutoPan: true}}
                                                anchor={markerMap[indexCircuit]}
                                                onCloseClick={onClickCloseInforWindow()}
                                                //position={{ lat: Number(itemCircuit.splfatLat), lng: Number(itemCircuit.splfatLng) }}
                                                // options = {{pixelOffset: new google.maps.Size (0, -30)}}
                                            >
                                                {/* className={`${itemCircuit.id==='1'?'bg-caribbean-green':'bg-lightorange'}`} */}
                                                <div  style={{fontWeight: 'bold', padding: '4px'}}>
                                                    <p className="m-0">{itemCircuit.splfatName} [ว่าง {itemCircuit.splfatAva}/{itemCircuit.splfatTotal}]</p>
                                                    <p className="m-0">ระยะทาง {itemCircuit.distance} เมตร</p>
                                                </div>
                                                
                                            </InfoWindow>
                                        }
                                    </Marker>
                                }
                            </div>    
                    )
                })}

                {/* Marker สถานที่ติดตั้ง */}
                {installLatLng.lat && installLatLng.lng &&
                    <div>
                        <Marker
                            infoWindowKey="installLocationMarker"
                            position={{ lat: Number(installLatLng.lat), lng: Number(installLatLng.lng) }}
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
                }

                {/* Marker สถานที่ที่เลือก */}
                <Marker
                    infoWindowKey="installLocationMarker"
                    position={{ lat: Number(placeSelectedLatLng.lat), lng: Number(placeSelectedLatLng.lng) }}
                    onClick={onClickPlaceSelectedMarker({ lat: Number(placeSelectedLatLng.lat), lng: Number(placeSelectedLatLng.lng) })}
                >
                </Marker>
                
                {/* Poly เส้นทางระยะข่ายสาย Auto */}
                {(pathInstallPlaceAndEquipmentList.length === props.documentWorkData.workDetl[0].file.length) &&  pathInstallPlaceAndEquipmentList.map((item,index) => {
                        //console.log("pathInstallPlaceAndEquipmentList[",index,"] : ",item);
                        
                        //console.log("routeInstallPlaceAndEquipmentList[",index,"].legs[0].overview_path : ",routeInstallPlaceAndEquipmentList[index].overview_path );
                        //console.log("routeInstallPlaceAndEquipmentList[",index,"].legs[0].distance.value : ",routeInstallPlaceAndEquipmentList[index].legs[0].distance.value ,"เมตร");
                        return (
                            <Polyline
                                key={index}
                                path={item}
                                geodesic={true}
                                options={{
                                    strokeColor: strokeColorList[index],
                                    strokeOpacity: 1,
                                    strokeWeight: ((index+1)*5),
                                    clickable: false,
                                    zIndex : pathInstallPlaceAndEquipmentList.length - index
                                }}
                            />
                        )
                    })
                    
                }
                
                {/* Poly เส้นทางระยะข่ายสาย ผู้ใช้งานวาด */}
                {pathUserDraw.length > 1 &&
                    <div>
                        <Polyline
                            path={pathUserDraw}
                            geodesic={true}
                            options={{
                                strokeColor: '#ff48e1',
                                strokeOpacity: 1,
                                strokeWeight: 5,
                                clickable: true,
                                zIndex:99
                            }}
                            onLoad={polyline => onLoadUserDrawPolyline(polyline)}
                        />
                        {infoWindowForUserDrawPolylineOpen &&
                            <InfoWindow
                                onCloseClick={onClickCloseInforWindowForUserDrawPolyline()}
                                position={inBetween}
                            >
                                <span>ระยะข่ายสาย {distanceInstallPlaceAndEquipment} เมตร</span>
                            </InfoWindow>
                        }
                    </div>
                }

                {/* สำหรับแสดงข้อความ ไม่พบข้อมูลข่ายสาย */}
                {( (props.haveCircuitList === false) || (props.haveMoreThan500Distance >= circuitList.length && props.haveCircuitList != null) )  &&
                    <OverlayView
                    position={{ lat:  Number(installLatLng.lat), lng: Number(installLatLng.lng)}}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className="map-info">
                            <WarnIcon className="icon" width="50px" height="50px" />
                            <div className="card">
                                ตำแหน่งสถานที่ติดตั้ง ทางระบบไม่พบข้อมูล
                                <br/>
                                ข่ายสายในพื้นที่ให้บริการ ภายในรัศมี 500 เมตร
                            </div>   
                        
                        </div>
                    </OverlayView>
                }

                <span></span> {/*for fix  error*/}
                <div
                    ref={divAutoCompletePlaceRef} 
                    className={`input-allow-clear search-box-on-map ${isMapFullScreen?'':'v-hide'}`}
                >
                    <input
                        className="ant-input"
                        ref={autoCompletePlaceRef2}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="ระบุชื่อสถานที่ต้องการค้นหา"
                        value={query}
                        style={{width: '350px',marginTop: '10px',marginBottom: '10px',marginLeft: '10px'}}
                    />
                    <CloseCircleFilled className="clear-button ant-input-clear-icon" onClick={clickClearPalceSearch()}/>
                </div>

            </GoogleMap>

        ) : <></>
    )
});

export default React.memo(MapCheckService)