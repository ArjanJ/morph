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

  function constructTransformString(type, value) {
    const currentString = from.style[transformString];
    if (currentString.length) {
      const props = currentString.split(') ').map(p => p.includes(')') ? p : `${p})`);
      const sameTransformIndex = props.findIndex(p => p.startsWith(type));
      if (sameTransformIndex > - 1) {
        const replacedProps = props.map(p => {
          if (p.startsWith(type)) { return `${type}(${value})`; }
          return p;
        });
        return replacedProps.join('');
      } else {
        const updatedProps = [...props, `${type}(${value})`];
        return updatedProps.join('');
      }
    } else {
      return `${type}(${value})`;
    }
  }

  function applyMorph() {
    const { transX, transY, scaleX, scaleY } = transform;
    return apply(() => from.style[transformString] = `translate(${transX}px, ${transY}px) scale(${scaleX}, ${scaleY})`);
  }

  function applyScale(x = transform.scaleX || 1, y = transform.scaleY || 1) {
    return apply(() => from.style[transformString] = constructTransformString('scale', `${x}, ${y}`));
  }

  function applyTranslate(x = transform.transX || 0, y = transform.transY || 0) {
    return apply(() => from.style[transformString] = constructTransformString('translate', `${x}px, ${y}px`));
  }

  function apply(cb) {
    window.requestAnimationFrame(cb);
  }

  function applyCss(props) {
    const transforms = ['scale', 'translate', 'rotate', 'skew'];
    for (const key in props) {
      if (transforms.includes(key)) {
        return apply(() => from.style.transform = constructTransformString(key, props[key]));
      }
      from.style[key] = props[key];
    }
  }

  function reset(prop) {
    if (typeof prop !== 'string') {
      return from.removeAttribute('style');
    } else {
      return from.style.removeProperty(prop);
    }
  }

  function next(callbacks) {
    const complete = () => {
      from.removeEventListener(transitionendString, complete);
      if (typeof callbacks[0] === 'function') {
        callbacks[0]();
      } else if (typeof callbacks[0] === 'object') {
        applyCss(callbacks[0]);
      } else {
        console.error('M.next() only accepts a list of functions or object literals.');
      }
      callbacks.splice(0, 1);
      if (callbacks.length) {
        next(callbacks);
      }
    };

    from.addEventListener(transitionendString, complete);
  }

  return {
    next,
    morph: applyMorph,
    reset,
    scale: applyScale,
    translate: applyTranslate,
    transform,
  };
};

export default Morph;
