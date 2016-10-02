const Morph = (from, to) => {
  const fromOffset = from && from.nodeType ? from.getBoundingClientRect() : from;
  const toOffset = to && to.nodeType ? to.getBoundingClientRect() : to;
  const transitionendString = getTransitionString();
  const transformString = getTransformString();
  let transform = {};

  function getTransitionString() {
    const transitions = {
      'transition': 'transitionend',
	    'WebkitTransition': 'webkitTransitionEnd',
	    'MozTransition': 'transitionend',
	    'OTransition': 'otransitionend',
    };
    const elem = document.createElement('div');
    let transitionendString;

    for (let t in transitions) {
      if (typeof elem.style[t] !== 'undefined') {
        transitionendString = transitions[t];
        break;
      }
    }

    elem.remove();
    return transitionendString;
  }

  function getTransformString() {
    const domPrefixes = 'Webkit Moz ms'.split(' ');
    const elem = document.createElement('div');
    let transformString = 'Transform';

    for (let i = 0; i < domPrefixes.length; i++) {
	    if (elem.style[`${domPrefixes[i]}Transform`] !== undefined) {
	      transformString = `${domPrefixes[i]}Transform`;
	      break;
	    }
	  }

    elem.remove();
    return transformString;
  }

  function scale() {
    const scaleX = (toOffset.width / fromOffset.width).toFixed(3);
    const scaleY = (toOffset.height / fromOffset.height).toFixed(3);
    transform.scaleX = scaleX,
    transform.scaleY = scaleY;
    apply();
    return this;
  }

  function translate() {
    const transX = (toOffset.left - fromOffset.left);
    const transY = (toOffset.top - fromOffset.top);
    transform.transX = transX,
    transform.transY = transY;
    apply();
    return this;
  }

  function apply() {
    window.requestAnimationFrame(applyTransform);
  }

  function applyTransform() {
    const s = (x, y) => `scale(${x}, ${y})`;
    const t = (x, y) => `translate(${x}px, ${y}px)`;
    const transformValue = `${t(transform.transX || 0, transform.transY || 0)} ${s(transform.scaleX || 1, transform.scaleY || 1)}`;
    return from.style[transformString] = transformValue;
  }

  function reset() {
    from.removeAttribute('style');
    return this;
  }

  function then(cb, el = from, delay = 0) {
    if (!el || !el.nodeType) { return null; }
    return new Promise((resolve, reject) => {
      const complete = () => {
        el.removeEventListener(transitionendString, complete);
        setTimeout(cb, delay);
        resolve(this);
      };
      el.addEventListener(transitionendString, complete);
    });
  }

  return {
    reset,
    scale,
    translate,
    transform,
    then,
  };
};

export default Morph;
