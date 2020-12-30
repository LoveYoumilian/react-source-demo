import Component from '../React/component';
import { diff, diffNode } from './diff';

export const createComponent = (comp, props) => {
  let inst;
  //  判断是类组件还是函数组件
  if (comp.prototype && comp.prototype.render) {
    //类组件
    inst = new comp(props);
  } else {
    //如果是函数,将函数组件扩展成类组件,方便后面统一处理
    inst = new Component(props);

    inst.constructor = comp; //将构造的对象construction的属性指向传进来的函数
    inst.render = () => inst.constructor(props);
  }
  return inst;
};
export const setComponentProps = (comp, props) => {
  //设置属性
  comp.props = props;
  if (!comp.base) {
    comp.componentWillMount && comp.componentWillMount();
  } else if (comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps();
  }
  //渲染节点
  renderComponent(comp);
};
export const unmountComponent = (dom) => {
  console.log('移除组件');
  dom && dom.parentNode && dom.parentNode.removeNode(dom);
};
export const renderComponent = (comp) => {
  let base;
  const renderer = comp.render(); //返回jsx对象
  // base = _render(rendered); //返回节点对象
  base = diffNode(comp.base, renderer);
  if (comp.base) {
    comp.componentWillUpdate && comp.componentWillUpdate();
    comp.componentDidUpdate && comp.componentDidUpdate();
  } else if (comp.componentDidMount) {
    comp.componentDidMount();
  }
  // // 如果调用了setState,节点替换
  // if (comp.base && comp.base.parentNode) {
  //   comp.base.parentNode.replaceChild(base, comp.base);
  // }
  comp.base = base;
};
const _render = (vNode) => {
  // 判断节点类型
  if (
    vNode === undefined ||
    vNode === null ||
    vNode === '' ||
    typeof vNode === 'boolean'
  ) {
    return;
  }
  if (typeof vNode === 'number') {
    vNode = String(vNode);
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
      const comp = createComponent(tag, attr);
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
const render = (node, container, dom) => {
  // return container.appendChild && container.appendChild(_render(node));
  return diff(dom, node, container);
};
export const setAttributeFunc = (dom, key, value) => {
  // 判断key的类型
  // 如果key是类名直接转换成class
  if (key === 'className') {
    key = 'class';
  }
  // 1是事件 如onClick,onBlur...
  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || '';
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
