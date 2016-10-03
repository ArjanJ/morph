import Morph from './morph';

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
    M.translate();
    M.scale();
    // M.next([
    //   M.translate,
    //   () => components.box1.style.opacity = '0.5',
    //   () => components.box1.style.background = 'blue',
    //   M.reset.bind(this, 'scale'),
    //   M.reset.bind(this, 'translate'),
    //   M.reset,
    // ]);
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
    M.translate()
    M.scale();
  }

  function handleReset() {
    const { modal } = components;
    M.translate()
    M.scale();
    M.next([
      () => modal.style.opacity = '0',
      () => components.modal.classList.remove('modal--active'),
      M.reset,
    ]);
  }

  function init() {
    components.modalBtn.addEventListener('click', handleMorphClick);
    components.btnReset.addEventListener('click', handleReset);
    components.modalBtn.addEventListener('mouseover', handleMorphHover);
    components.modalBtn.addEventListener('mouseout', () => M.reset());
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
    M.scale();
    M.next([
      M.translate,
      () => components.box1.style.opacity = '0.2',
      M.reset.bind(this, 'translate'),
      () => components.box1.style.background = 'blue',
      M.reset.bind(this, 'scale'),
      () => components.box1.style.opacity = '1',
      () => components.box1.style.background = 'darkmagenta',
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
