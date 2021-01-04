import { renderComponent } from '../React-dom/index';
const setStateQueue = []; //修改的队列
const renderQueue = []; //渲染的组件
//创建队列
//队列 :先进先出
const defer = (fn) => {
  return Promise.resolve().then(fn);
};
// 定义一个flush方法,它的作用就是清空队列
const flush = () => {
  let item, comPonent;
  //遍历state
  while ((item = setStateQueue.shift())) {
    const { stateChange, component } = item;
    // 如果没有prevState,则当前的state作为初始的prevState
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state);
    }
    // 如果stateChange是一个方法,也就是setState的第一种形式
    if (typeof stateChange === 'function') {
      Object.assign(
        component.state,
        stateChange(component.prevState, component.props)
      );
    } else {
      // 如果stateChange是一个对象,则直接合并到setState中
      Object.assign(component.state, stateChange);
    }
    component.prevState = component.state;
  }
  // 遍历组件
  while ((comPonent = renderQueue.shift())) {
    renderComponent(comPonent);
  }
};
export const enqueueSetState = (stateChange, component) => {
  console.log('component', component);
  // 如果setStateQueue的长度是0,也就是在上次flush执行之后第一次往队列里添加
  if (setStateQueue.length === 0) {
    defer(flush);
  }
  //入队 让所有设置的状态 都放入到队列中
  setStateQueue.push({
    stateChange,
    component,
  });

  // 如果renderQueue里没有当前组件,则添加到队列中
  let r = renderQueue.some((item) => {
    return item === component;
  });
  if (!r) {
    renderQueue.push(component);
  }
};
