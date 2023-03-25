import React, { useState, useEffect } from "react";
import { Input } from "semantic-ui-react";
import {
  useMap,
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
} from "react-leaflet";
import axios from "axios";
import "./App.css";

const App = () => {
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState("193.62.157.66");
  const [position, setPosition] = useState([51.505, -0.09]);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const URL = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${API_KEY}&ipAddress=${searchTerm}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(URL);
        setData(res.data);
        setPosition([res.data.location.lat, res.data.location.lng]);
      } catch (err) {
        console.log(err);
      }
    };
    if (searchTerm) {
      fetchData();
    } else {
      setPosition([51.505, -0.09]);
    }
  }, [searchTerm]);

  function ChangeView() {
    const map = useMap();
    map.flyTo(position, 13, {
      animate: true,
    });
    return null;
  }

  return (
    <div className="App">
      <header>
        <div className="title">IP Address Tracker</div>
        <div className="search">
          <Input
            className="search-bar"
            action={{
              color: "black",
              icon: "right arrow",
              onClick: () => {
                const input = document.querySelector("input").value;
                if (input === "") {
                  alert("Please enter an IP address or domain");
                } else {
                  setSearchTerm(input);
                }
              },
            }}
            style={{
              margin: "0 auto",
            }}
            placeholder="Search for any IP address or domain"
            size="big"
          />
        </div>
        <div className="container">
          <div className="ip-details-container">
            <div className="ip-address">
              <div className="ip-details-key">IP ADDRESS</div>
              <div className="ip-details-value">{data.ip || "Not found"}</div>
            </div>
            <div className="hr"></div>
            <div className="location">
              <div className="ip-details-key">LOCATION</div>
              <div className="ip-details-value">{`${
                data.location?.city || "Not found"
              }, ${data.location?.region || ""} ${
                data.location?.postalCode || ""
              }`}</div>
            </div>
            <div className="hr"></div>
            <div className="timezone">
              <div className="ip-details-key">TIMEZONE</div>
              <div className="ip-details-value">{`UTC${
                data.location?.timezone || "Not found"
              }`}</div>
            </div>
            <div className="hr"></div>
            <div className="isp">
              <div className="ip-details-key">ISP</div>
              <div className="ip-details-value">{data.isp || "Not found "}</div>
            </div>
          </div>
        </div>
      </header>
      {position && (
        <MapContainer center={position} zoom={13} zoomControl={false}>
          <ChangeView />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <Marker position={position}>
            <Popup>
              {data.location?.city}, {data.location?.region}{" "}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default App;
