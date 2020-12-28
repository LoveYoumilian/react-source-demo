import Component from '../React/component';

const creatComponent = (comp, props) => {
  let inst;
  //  判断是类组件还是函数组件
  if (comp.prototype && comp.prototype.render) {
    //类组件
    inst = new comp(props);
  } else {
    //如果是函数,将函数组件扩展成类组件,方便后面统一处理
    inst = new Component(props);

    inst.construct = comp; //将构造的对象construction的属性指向传进来的函数
    inst.render = () => inst.construct(props);
  }
  return inst;
};
const setComponentProps = (comp, props) => {
  //设置属性
  comp.props = props;
  //渲染节点
  renderComponent(comp);
};
const renderComponent = (comp) => {
  let base;
  const rendered = comp.render();//返回jsx对象
  base = _render(rendered);//返回节点对象
  console.log('base',base)
  comp.base = base;
};
const _render = (vNode) => {
  // 判断节点类型
  if (!vNode || typeof vNode === 'boolean') {
    return;
  }
  if (typeof vNode === 'string') {
    // 字符串类型
    return document.createTextNode(vNode);
  }
  //虚拟dom类型
  const { tag, attr, children } = vNode;
  // 判断tag类型
  if (tag) {
    if (typeof tag === 'function') {
      //如果tag是函数
      // 1.创建组件
      const comp = creatComponent(tag, attr);
      console.log('comp', comp);
      // 2.设置组件的属性
      setComponentProps(comp, attr);
      // 3.组件渲染的节点对象返回
      return comp.base;
    }
    //创建节点对象
    const dom = document.createElement(tag);
    if (attr) {
      // 对节点的属性进行循环
      Object.keys(attr).forEach((key) => {
        const value = attr[key];
        setAttributeFunc(dom, key, value); //设置属性
      });
    }
    //渲染子节点
    if (children) {
      children.forEach((child) => render(child, dom)); // 递归渲染
    }
    return dom;
  }
};
const render = (node, container) => {
  return container.appendChild(_render(node));
};
const setAttributeFunc = (dom, key, value) => {
  // 判断key的类型
  // 如果key是类名直接转换成class
  if (key === 'className') {
    key = 'class';
  }
  // 1是事件 如onClick,onBlur...
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value[key] || '';
  } else if (key === 'style') {
    // 2是样式 style
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (typeof value === 'object') {
      //样式是对象
      for (const k in value) {
        //循环样式
        if (typeof k === 'number') {
          dom.style[k] = value[k] + 'px';
        } else {
          dom.style[k] = value[k];
        }
      }
    }
  } else {
    // 3其他属性
    if (key in dom) {
      dom[key] = value || '';
    }
    if (value) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  }
};

const ReactDOM = {
  render,
};
export default ReactDOM;
