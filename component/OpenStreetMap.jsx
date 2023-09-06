import React, { useState, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { search } from "../lib/fetchData";
import CustomToast from "./CustomToast";
import Spinner from "react-bootstrap/Spinner";
import LocationMarker from "./LocationMarker";

const centerOfMap = { lat: 48.0908642, lng: -0.7527274 };

const OpenStreetMap = () => {
  const ZOOM_LEVEL = 15;
  const mapRef = useRef();
  const [address, setAddress] = useState("rue louis de broglie 53810 changé");
  const [results, setResults] = useState([]);
  const [location, setLocation] = useState(centerOfMap);
  const [showToast, setShowToast] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      setShowSpinner(true);

      const res = await search({ q: address });

      setResults(res);
    } catch {
      setShowToast(true);
      setResults(null);
    } finally {
      setShowSpinner(false);
    }
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.currentTarget.value)}
                  name="address"
                  type="text"
                  className="form-control"
                  placeholder="Enter location"
                />
                <button type="submit" className="btn btn-primary">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>
            </form>
            {showSpinner && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {results && (
              <div className="list-group list-group-flush">
                {results.map((result) => (
                  <a
                    key={result.osm_id}
                    href="#"
                    className="list-group-item list-group-item-action"
                    aria-current="true"
                    onClick={(e) => {
                      e.preventDefault();

                      const p = {
                        lat: parseFloat(result.lat, 10),
                        lng: parseFloat(result.lon, 10),
                      };

                      setLocation(p);
                    }}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">
                        {result.name ||
                          result.display_name.split(",")[0].trim()}
                      </h5>
                      <small>{result.type}</small>
                    </div>
                    <ul className="mb-1">
                      <li>Lon : {result.lon}</li>
                      <li>Lat : {result.lat}</li>
                    </ul>
                    <small>{result.display_name}</small>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="col-12 col-lg-7">
            <MapContainer center={location} zoom={ZOOM_LEVEL} ref={mapRef}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                pos={location}
                onError={() => setShowToast(true)}
              />
            </MapContainer>
          </div>
        </div>
      </div>
      {showToast && (
        <CustomToast
          title="Request Timeout"
          body="Unable to load OSM/Nominatim data"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default OpenStreetMap;
