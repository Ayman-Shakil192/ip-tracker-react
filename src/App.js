import React, { useState, useEffect } from "react";
import { Input } from "semantic-ui-react";
import { useMap, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "./App.css";

const App = () => {
  const [data, setData] = useState({});
  const [searchTerm, setSearchTerm] = useState("8.8.8.8");
  const [position, setPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_IVXW0GhkgnAyqTzAr7YsCePJvSoIz&ipAddress=${searchTerm}`
        );
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

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <div className="App">
      <header>
        <div className="title">IP Address Tracker</div>
        <div className="search">
          <Input
            action={{
              color: "black",
              labelPosition: "right",
              icon: "right arrow",
              content: "Search",
              onClick: () => {
                setSearchTerm(document.querySelector("input").value);
              },
            }}
            style={{
              width: "60%",
              margin: "0 auto",
            }}
            placeholder="Search for any IP address or domain"
          />
        </div>
        <div className="ip-details-container">
          <div className="ip-address">
            <div className="ip-details-key">IP ADDRESS</div>
            <div className="ip-details-value">{data.ip}</div>
          </div>
          <div className="hr"></div>
          <div className="location">
            <div className="ip-details-key">LOCATION</div>
            <div className="ip-details-value">{`${data.location?.city}, ${data.location?.region} ${data.location?.postalCode}`}</div>
          </div>
          <div className="hr"></div>
          <div className="timezone">
            <div className="ip-details-key">TIMEZONE</div>
            <div className="ip-details-value">{`UTC${data.location?.timezone}`}</div>
          </div>
          <div className="hr"></div>
          <div className="isp">
            <div className="ip-details-key">ISP</div>
            <div className="ip-details-value">{data.isp}</div>
          </div>
        </div>
      </header>
      {position && (
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
          <ChangeView center={position} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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
