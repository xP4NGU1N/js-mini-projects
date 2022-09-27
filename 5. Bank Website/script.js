'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const learnMoreBtn = document.querySelector('.btn--scroll-to');
learnMoreBtn.addEventListener('click', function () {
  console.log('test');
  document.querySelector('#section--1').scrollIntoView({ behavior: 'smooth' });
});

const navigation = document.querySelector('.nav');
navigation.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.target.style.color = 'rgb(255,0,0)';
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(sibling => {
      if (sibling !== e.target) sibling.style.opacity = '0.5';
    });
    document.querySelector('.nav__logo').style.opacity = '0.5';
  }
});
navigation.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(`${e.target.getAttribute('href')}`)
      .scrollIntoView({ behavior: 'smooth' });
  }
});
navigation.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.target.style.color = '#222';
    e.target
      .closest('.nav')
      .querySelectorAll('.nav__link')
      .forEach(tab => (tab.style.opacity = '1'));
    document.querySelector('.nav__logo').style.opacity = '1';
  }
});
console.log(navigation.style.height);
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navigation.getBoundingClientRect().height}px`,
};
const obsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navigation.classList.add('sticky');
  else navigation.classList.remove('sticky');
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(document.querySelector('.header'));

const operationTabs = document.querySelector('.operations__tab-container');
operationTabs.addEventListener('click', function (e) {
  document
    .querySelectorAll('.operations__tab')
    .forEach(tab => tab.classList.remove('operations__tab--active'));
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) {
    return;
  }
  const tab = clicked.dataset.tab;
  clicked.classList.add('operations__tab--active');
  document
    .querySelectorAll('.operations__content')
    .forEach(content =>
      content.classList.remove('operations__content--active')
    );
  document
    .querySelector(`.operations__content--${tab}`)
    .classList.add('operations__content--active');
});
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
const allSections = document.querySelectorAll('.section');
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
imgTargets.forEach(image => imgObserver.observe(image));

const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
let curSlide = 0;

const dotContainer = document.querySelector('.dots');
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide = "${i}"></button>`
    );
  });
};
createDots();
const goSlide = function (curSlide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%`)
  );
};
const activateDots = function (curSlide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${curSlide}"]`)
    .classList.add('dots__dot--active');
};
goSlide(curSlide);
activateDots(curSlide);
const nextSlide = function () {
  curSlide++;
  if (curSlide === slides.length) curSlide = 0;
  goSlide(curSlide);
  activateDots(curSlide);
};
const prevSlide = function () {
  if (curSlide === 0) curSlide = slides.length;
  curSlide--;
  goSlide(curSlide);
  activateDots(curSlide);
};
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    curSlide = e.target.dataset.slide;
    goSlide(curSlide);
    activateDots(curSlide);
  }
});
