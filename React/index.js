
const createElement = (tag, attr, ...children) => {
  return {
    tag,
    attr,
    children,
  };
};
const React = {
  createElement,
};
export default React;
