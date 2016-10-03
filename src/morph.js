const Morph = (from, to) => {
  const fromOffset = from && from.nodeType ? from.getBoundingClientRect() : from;
  const toOffset = to && to.nodeType ? to.getBoundingClientRect() : to;
  const transitionendString = getTransitionString();
  const transformString = getTransformString();
  const transform = Object.assign(scale(), translate());

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
    return {
      scaleX,
      scaleY,
    };
  }

  function translate(cb) {
    const transX = (toOffset.left - fromOffset.left);
    const transY = (toOffset.top - fromOffset.top);
    return {
      transX,
      transY,
    };
  }

  function applyScale() {
    return apply(() => from.style.scale = `${transform.scaleX || 1} ${transform.scaleY || 1}`);
  }

  function applyTranslate() {
    return apply(() => from.style.translate = `${transform.transX || 0}px ${transform.transY || 0}px`);
  }

  function apply(cb) {
    window.requestAnimationFrame(cb);
  }

  function reset(prop) {
    if (typeof prop !== 'string') {
      from.removeAttribute('style');
    } else {
      from.style.removeProperty(prop);
    }
    return this;
  }

  function next(callbacks) {
    const complete = () => {
      from.removeEventListener(transitionendString, complete);
      if (typeof callbacks[0] !== 'function') { return null; }
      window.requestAnimationFrame(callbacks[0]);
      callbacks.splice(0, 1);
      if (callbacks.length) {
        next(callbacks);
      }
    };

    from.addEventListener(transitionendString, complete);
  }

  return {
    reset,
    scale: applyScale,
    translate: applyTranslate,
    transform,
    next,
  };
};

export default Morph;
