import keyCodes from './keyCodes';

const autocomplete = (input, latInput, lngInput) => {
  if(!input) return;

  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();

    if(place.geometry) {
      latInput.value = place.geometry.location.lat();
      lngInput.value = place.geometry.location.lng();
    } else {
      console.warn('Could not find place on maps. Please enter location manually!');

      latInput.parentElement.classList.remove('hidden');
      lngInput.parentElement.classList.remove('hidden');
    }
  });

  input.on('keydown', (e) => {
    if(e.keyCode === keyCodes.ENTER) e.preventDefault();
  })
};

export default autocomplete;
