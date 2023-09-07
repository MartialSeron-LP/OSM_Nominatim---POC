import { useCallback, useEffect, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { reverse } from "../lib/fetchData";

function LocationMarker({ pos, onError }) {
  const markerRef = useRef(null);
  const [position, setPosition] = useState(pos);
  const [popupContent, setPopupContent] = useState(null);

  const map = useMapEvents({
    async click(e) {
      await placeMarker({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });

  const placeMarker = useCallback(async ({ lat, lon }) => {
    try {
      map.flyTo([lat, lon]);

      const d = await reverse({ lat, lon });

      if (d.error) {
        throw new Error(d.error);
      }
      
      setPosition({ lat, lon });

      setPopupContent(d);
      
      const marker = markerRef.current;

      if (marker) {
        marker.openPopup();
      }
    } catch (err) {
      console.error({ err });
      onError(err);
    }
  }, [map, onError]);

  useEffect(() => {
    placeMarker({ lat: pos.lat, lon: pos.lng }).catch(console.error);
  }, [pos, placeMarker]);

  return (
    <>
      {position && (
        <Marker position={position} ref={markerRef}>
          <Popup>
            {popupContent ? (
              <>
                <h5>{popupContent.name}</h5>
                <h6>
                  {popupContent.address?.postcode}{" "}
                  {popupContent.address?.village}
                </h6>

                <ul>
                  <li>Lon : {popupContent.lon}</li>
                  <li>Lat : {popupContent.lat}</li>
                </ul>
              </>
            ) : (
              "Error while fetching OSM data"
            )}
          </Popup>
        </Marker>
      )}
    </>
  );
}

export default LocationMarker;
