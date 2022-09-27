'use strict';

const showModal = document.querySelectorAll('.show-modal');
const hideModal = document.querySelectorAll('.close-modal');
const modal = document.querySelectorAll('.modal');
const overlay = document.querySelectorAll('.overlay');

for (let i = 0; i < showModal.length; i++) {
  showModal[i].addEventListener('click', function () {
    modal[i].classList.remove('hidden');
    overlay[i].classList.remove('hidden');
  });

  hideModal[i].addEventListener('click', function () {
    modal[i].classList.add('hidden');
    overlay[i].classList.add('hidden');
  });

  document.addEventListener('keydown', function (btn) {
    if (btn.key === 'Escape' && !modal[i].classList.contains('hidden')) {
      modal[i].classList.add('hidden');
      overlay[i].classList.add('hidden');
    }
  });
}
