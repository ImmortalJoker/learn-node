import '../sass/style.scss';

import {$, $$} from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxFavorite from './modules/favoriteStores';

autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));

const map = $('#map');

if (map) {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  const success = (pos) => {
    makeMap(map, pos.coords);
  };

  const error = (err) => {
    makeMap(map);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
}

$$('form.heart').on('submit', ajaxFavorite);