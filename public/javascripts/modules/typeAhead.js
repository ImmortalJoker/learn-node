import axios from 'axios';
import dompurify from 'dompurify';
import {STORE_URL, API_SEARCH_WITH_QUERY_URL} from '../../../routes/constants';
import keyCodes from './keyCodes';

const searchResultsHTML = (stores) =>
  stores.map(store => (`
    <a href="${STORE_URL(store.slug)}" class="search__result">
        <strong>${store.name}</strong>
    </a>
`)).join('');

export default function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function () {
    if (!this.value) {
      searchResults.style.display = 'none';

      return;
    }

    searchResults.style.display = 'block';

    axios
      .get(API_SEARCH_WITH_QUERY_URL(this.value))
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
          return;
        } else {
          searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

  searchInput.on('keyup', e => {
    if (![38, 40, 13].includes(e.keyCode)) return;

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    switch (e.keyCode) {
      case keyCodes.ARROW_DOWN:
        next = current && current.nextElementSibling || items[0];
        break;

      case keyCodes.ARROW_UP:
        next = current && current.previousElementSibling || items[items.length - 1];
        break;

      case current && keyCodes.ENTER:
        window.location = current.href;
        return;

      default:
        break;
    }

    if (current) {
      current.classList.remove(activeClass);
    }

    next.classList.add(activeClass);
  });
}
