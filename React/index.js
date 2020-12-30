import Component from './component';
const createElement = (tag, attr = {}, ...children) => {
  return {
    tag,
    attr,
    children,
    key: (attr && attr.key) || null,
  };
};
export default {
  createElement,
  Component,
};
