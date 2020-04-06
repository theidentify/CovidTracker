import React from 'react';

const totalKeyArray = ['confirmed', 'recovered', 'deaths'];

function ListView({ locationArr, selectedLocation, onSelectItem,onDeselectItem}) {
  const totalElements = totalKeyArray.map(key => {
    const sum = locationArr.reduce((acc, curr) => acc + curr.latest[key], 0);
    return (
      <div key={key} className="columns">
        <div className="column">
          <h6 className="title is-6">{key}</h6>
        </div>
        <div className="column">
          <p className="is-6 has-text-right">{sum}</p>
        </div>
      </div>
    );
  });
  const locationElements = locationArr.map(location => {
    const {
      id,
      country_code,
      country,
      province,
      latest: { confirmed },
    } = location;

    let title = country;
    if (province !== '' && province !== country) {
      title = `${province}, ${country}`;
    }

    let locationClass = "list-view-location";
    if(!!selectedLocation){
      if(location.id === selectedLocation.id){
        locationClass += ' selected';
      }
    }

    return (
      <div onClick={() => onClickItem(id)} className={locationClass} key={`${id}-${country_code}`}>
        <div className="columns" >
          <div className="column">
            <h6 className="title is-6">{title}</h6>
          </div>
          <div className="column">
            <p className="is-6 has-text-right">{confirmed}</p>
          </div>
        </div>
      </div>
    );
  });

  function onClickItem(id){
    if(!selectedLocation) onSelectItem(id);
    else if(selectedLocation.id !== id) onSelectItem(id);
    else onDeselectItem();
  }

  return (
    <div className="list-view">
      <div className="list-view-brand">
        <h2 className="title is-4">COVID-19 Tracker</h2>
      </div>
      <div className="list-view-total">
        <h2 className="title is-4">Total</h2>
        {totalElements}
      </div>
      <div className="list-view-locations">{locationElements}</div>
    </div>
  );
}

export default ListView;
