import Morph from './morph';
import './morph.scss';

function $(query) {
  return document.querySelector(query);
}

const Simple = () => {
  const components = {
    box1: $('#box-simple-1'),
    box2: $('#box-simple-2'),
    btnActive: $('#btn-simple-active'),
    btnReset: $('#btn-simple-reset'),
  };

  const M = Morph(components.box1, components.box2);

  function handleMorphClick() {
    M.morph();
  }

  function init() {
    const { btnActive, btnReset } = components;
    btnActive.addEventListener('click', handleMorphClick);
    btnReset.addEventListener('click', () => M.reset());
  }

  init();
};

const Modal = () => {
  const components = {
    modal: $('.modal'),
    modalBtn: $('.modal-button'),
    btnReset: $('#btn-modal-reset'),
  };

  const M = Morph(components.modal, components.modalBtn);

  function handleMorphClick() {
    components.modal.classList.add('modal--active');
    M.reset();
  }

  function handleMorphHover() {
    M.morph();
  }

  function handleReset() {
    const { modal } = components;
    M.morph();
    M.next([
      { opacity: 0 },
      () => components.modal.classList.remove('modal--active'),
      M.reset,
    ]);
  }

  function init() {
    components.modalBtn.addEventListener('click', handleMorphClick);
    components.btnReset.addEventListener('click', handleReset);
    components.modalBtn.addEventListener('mouseover', handleMorphHover);
    components.modalBtn.addEventListener('mouseout', M.reset);
  }

  init();
};

const Sequence = () => {
  const components = {
    box1: $('#box-sequence-1'),
    box2: $('#box-sequence-2'),
    btnActive: $('#btn-sequence-active'),
    btnReset: $('#btn-sequence-reset'),
  };

  const M = Morph(components.box1, components.box2);

  function handleMorphClick() {
    M.morph();
    M.next([
      { background: 'blue' },
      { rotate: '30deg' },
      { opacity: 0.5 },
      { scale: '1' },
      { translate: '200px, 50px' },
      M.reset,
    ]);
  }

  function init() {
    const { btnActive, btnReset } = components;
    btnActive.addEventListener('click', handleMorphClick);
    btnReset.addEventListener('click', () => M.reset());
  }

  init();
};

document.addEventListener('DOMContentLoaded', () => {
  Simple();
  Modal();
  Sequence();
});
