import Morph from './morph';

function $(query) {
  return document.querySelector(query);
}

const Simple = () => {
  const components = {
    box1: $('.box-1'),
    box2: $('.box-2'),
    btnActive: $('#btn-simple-active'),
    btnReset: $('#btn-simple-reset'),
  };

  const M = Morph(components.box1, components.box2);

  function handleMorphClick() {
    M.translate().scale();
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
});
