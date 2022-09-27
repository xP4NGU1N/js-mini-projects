'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const reset = document.querySelector('.reset');
const activityType = document.querySelector('.view__activity');
const viewAll = document.querySelector('.viewall');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / this.duration;
  }
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
class App {
  #activities = [];
  #map;
  #markerCoords;
  constructor() {
    this._getLocalStorage();
    this._getPosition();
    form.addEventListener('submit', this._addEvent.bind(this));
    inputType.addEventListener('change', this._toggleType);
    containerWorkouts.addEventListener('click', this._shiftMap.bind(this));
    reset.addEventListener('click', this._reset);
    activityType.addEventListener('change', this._filterType.bind(this));
    viewAll.addEventListener('click', this._viewAllWorkouts.bind(this));
  }
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert('Could not get your location.');
      }
    );
  }
  _loadMap(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    this.#map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._showForm.bind(this));
    this.#activities.forEach(activity => this._markMap(activity));
  }
  _showForm(coords) {
    form.classList.remove('hidden');
    inputDistance.focus();
    this.#markerCoords = coords.latlng;
  }
  _toggleType() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _addEvent(e) {
    e.preventDefault();
    const checkNumber = (...values) =>
      values.every(value => Number.isFinite(value));
    const checkPositive = (...values) => values.every(value => value > 0);
    const { lat: markerLat, lng: markerLong } = this.#markerCoords;
    let activity;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const type = inputType.value;

    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        !checkNumber(distance, duration, cadence) ||
        !checkPositive(distance, duration, cadence)
      )
        return alert('Inputs must be positive numbers!');

      activity = new Running(
        [markerLat, markerLong],
        distance,
        duration,
        cadence
      );
    } else if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !checkNumber(distance, duration, elevation) ||
        !checkPositive(distance, duration, elevation)
      )
        return alert('Inputs must be positive numbers!');
      activity = new Cycling(
        [markerLat, markerLong],
        inputDistance.value,
        inputDuration.value,
        inputElevation.value
      );
    }
    this.#activities.push(activity);
    this._markMap(activity);
    this._displayEvent(activity);
    this._hideForm();
    this._setLocalStorage();
  }
  _markMap(activity) {
    L.marker(activity.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          maxHeight: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${activity.type}-popup`,
        }).setContent(
          `${activity.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${activity.description}`
        )
      )
      .openPopup();
  }
  _displayEvent(activity) {
    let html = `
    <li class="workout workout--${activity.type}" data-id="${activity.id}">
    <h2 class="workout__title">${activity.description}</h2>
        <div class="workout__details">
      <span class="workout__icon">${
        activity.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${activity.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${activity.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;
    if (activity.type === 'running')
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${activity.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${activity.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`;

    if (activity.type === 'cycling')
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${activity.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${activity.elevation}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>`;

    form.insertAdjacentHTML('afterend', html);
  }
  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _shiftMap(e) {
    const workout = e.target.closest('.workout');
    if (!workout) return;
    const workoutID = workout.dataset.id;
    const newCoords = this.#activities.find(
      work => work.id === workoutID
    ).coords;
    this.#map.setView(newCoords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#activities));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#activities = data;
    this.#activities.forEach(activity => this._displayEvent(activity));
  }
  _reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
  _filterType() {
    const displayType = activityType.value;
    const runningActivity = document.querySelectorAll('.workout--running');
    const cyclingActivity = document.querySelectorAll('.workout--cycling');
    if (displayType === 'all') {
      runningActivity.forEach(activity => activity.classList.remove('hidden'));
      cyclingActivity.forEach(activity => activity.classList.remove('hidden'));
    } else if (displayType === 'running') {
      runningActivity.forEach(activity => activity.classList.remove('hidden'));
      cyclingActivity.forEach(activity => activity.classList.add('hidden'));
    } else if (displayType === 'cycling') {
      cyclingActivity.forEach(activity => activity.classList.remove('hidden'));
      runningActivity.forEach(activity => activity.classList.add('hidden'));
    }
  }
  _viewAllWorkouts() {
    const markers = [];
    this.#activities.forEach(activity =>
      markers.push(L.marker(activity.coords))
    );
    const group = new L.featureGroup(markers);
    this.#map.fitBounds(group.getBounds().pad(0.1));
  }
}
const app = new App();
