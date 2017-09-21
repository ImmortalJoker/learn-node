import axios from 'axios';
import {$} from './bling'
import {
  API_STORES_NEAR_WITH_QUERY_URL,
  STORE_URL,
  UPLOADS_RESOURCES_URL,
} from '../../../routes/constants';

const mapsOption = {
  center: {
    lat: 50.4310737,
    lng: 30.5093819,
  },
  zoom: 12,
};

function loadPlaces(map, lat = 50.4310737, lng = 30.5093819) {
  axios
    .get(API_STORES_NEAR_WITH_QUERY_URL([lat, lng]))
    .then(res => {
      const places = res.data;

      if (!places) {
        console.log('no places found!');
        return;
      }

      //create a bounds
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();
      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = {
          lat: placeLat,
          lng: placeLng
        };
        bounds.extend(position);
        const marker = new google.maps.Marker({map, position});

        marker.place = place;

        return marker;
      });

      //handle marker click
      markers.forEach(marker => marker.addListener('click', function () {
        const {
          slug,
          photo,
          name,
          location,
        } = this.place;
        const imageSrc = photo || 'store.png';
        const html = `
          <div class="popup">
            <a href=${STORE_URL(slug)}>
                <img src=${UPLOADS_RESOURCES_URL(imageSrc)} alt=${name} />
                
                <p>${name} - ${location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this)
      }));

      //zoom the map to fit all markers
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
    });
}

function makeMap(mapDiv, coordinates) {
  if (!mapDiv) return;

  if (coordinates) {
    Object.assign(mapsOption, {
      center: {
        lat: coordinates.latitude,
        lng: coordinates.longitude
      },
      zoom: 16,
    });
  }

  const map = new google.maps.Map(mapDiv, mapsOption);

  loadPlaces(map);

  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  })
}

export default makeMap;