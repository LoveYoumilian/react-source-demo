/*
dom:真实DOM
vNode:虚拟DOM
container: 容器
return : 更新后的DOM
*/
import { createComponent, setComponentProps, setAttributeFunc } from './index';
export const diff = (dom, vNode, container) => {
  let ret = diffNode(dom, vNode); //比较节点
  container && container.appendChild(ret);
  return ret;
};
export const diffNode = (dom, vNode) => {
  let out = dom; //判断节点类型
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
  //字符串
  if (typeof vNode === 'string') {
    //如果当前节点是文本节点,直接更新内容
    if (dom && dom.nodeType === 3) {
      dom.textContent !== vNode && (dom.textContent = vNode);
    } else {
      //如果dom不是文本节点,则创建一个文本点dom,并移除原来的dom
      out = document.createTextNode(vNode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(out, dom);
      }
    }
    return out;
  }
  //如果是一个组件
  if (typeof vNode.tag === 'function') {
    return diffComponent(dom, vNode);
  }
  // 如果是非文本DOM节点
  // 真实DOM不存在
  if (!dom) {
    out = document.createElement(vNode.tag);
  }
  // 如果真实DOM存在,需要对比属性和对比子节点
  diffAttributes(out, vNode);
  if (
    (vNode.children && vNode.children.length > 0) ||
    (out.childNodes && out.childNodes.length > 0)
  ) {
    diffChildren(out, vNode.children);
  }

  return out;
};
const diffComponent = (dom, vNode) => {
  let comp = dom;
  //如果组件没变化,则重新设置props
  if (comp && comp.constructor === vNode.tag) {
    //重新设置props
    setComponentProps(comp, vNode.attr);
    //赋值
    dom = comp.base;
  } else {
    // 如果组件类型变化,则移除掉原来组件,并渲染新组件
    // 移除
    if (comp) {
      unmountComponent(comp);
      comp = null;
    }
    //核心代码
    // 1.创建新组件
    comp = createComponent(vNode.tag, vNode.attr);
    // 2.设置组件属性
    setComponentProps(comp, vNode.attr);
    // 挂载当前新的组件
    dom = comp.base;
  }
  return dom;
};
const diffAttributes = (dom, vNode) => {
  // 保存之前的真实DOM的所有属性
  const oldAttrs = {};
  const newAttrs = vNode.attr; //虚拟DOM的属性 (也是最新的属性)
  // 获取真实DOM属性
  const domAttrs = dom.attributes;
  // const domAttrs =  document.querySelector('#root').attributes;
  [...domAttrs].forEach((item) => {
    oldAttrs[item.name] = item.value;
  });
  // 比较
  // 如果原来的属性不在新的属性当中,则将其移除掉  (属性值直接设置undefined)
  for (let key in oldAttrs) {
    if (!(key in newAttrs)) {
      // 移除
      setAttributeFunc(dom, key, undefined);
    }
  }
  // 更新新的属性值
  for (let key in newAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      console.log(dom, newAttrs[key], key);
      // 只更值不相等的属性
      setAttributeFunc(dom, key, newAttrs[key]);
    }
  }
};
const diffChildren = (dom, vChildren) => {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};
  // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开
  if (domChildren.length > 0) {
    [...domChildren].forEach((item) => {
      // 获取key
      const key = item.key;
      if (key) {
        // 如果key存在,保存到对象中
        keyed[key] = item;
      } else {
        // 如果key不存在,保存到数组中
        children.push(item);
      }
    });
  }
  if (vChildren && vChildren.length > 0) {
    let min = 0;
    let childrenLen = children.length; //2
    [...vChildren].forEach((vChild, i) => {
      // 获取虚拟DOM中所有的key
      const key = vChild.key;
      let child;
      if (key) {
        // 如果有key,找到对应key值的节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        // alert(1);
        // 如果没有key,则优先找类型相同的节点
        for (let j = min; j < childrenLen; j++) {
          let c = children[j];
          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }
      // 对比
      child = diffNode(child, vChild);
      // 更新DOM
      const f = domChildren[i];
      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child);
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        } else if (child === f.nextSibling) {
          removeNode(f);
          // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
          dom.insertBefore(child, f);
        }
      }
    });
  }
};
