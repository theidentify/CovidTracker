import React, { useState, useEffect, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import MapView from './components/MapView';
import './Css/App.scss';
import Axios from 'axios';
import ListView from './components/ListView';
import DetailsView from './components/DetailsView';

const api = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations';

function App() {
  const [locationArr, setLocationArr] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([13, 100]);

  function sortedLocationArray(locations) {
    return [...locations].sort((location1, location2) => {
      return location2.latest.confirmed - location1.latest.confirmed;
    });
  }

  const onSelectLocation = useCallback(
    id => {
      const location = locationArr.find(location => location.id === id);
      if (!location) {
        setSelectedLocation(null);
        return;
      }
      const {
        coordinates: { latitude, longitude },
      } = location;
      setMapCenter([latitude, longitude]);
      setSelectedLocation(location);
    },
    [locationArr],
  );

  const onDeselectLocation = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  useEffect(() => {
    Axios.get(api)
      .then(response => {
        const sortedLocations = sortedLocationArray(response.data.locations);
        setLocationArr(sortedLocations);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  let detailsView = null;
  if (!!selectedLocation) {
    detailsView = (
      <DetailsView
        location={selectedLocation}
        onClickClose={onDeselectLocation}
      />
    );
  }

  return (
    <div>
      <ListView
        locationArr={locationArr}
        selectedLocation={selectedLocation}
        onSelectItem={onSelectLocation}
        onDeselectItem={onDeselectLocation}
      />
      <MapView onSelectMarker={onSelectLocation} locationArr={locationArr} mapCenter={mapCenter} />
      {detailsView}
    </div>
  );
}

export default App;
