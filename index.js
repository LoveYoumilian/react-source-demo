import React from './React/index';
import ReactDom from './React-dom/index';
//普通的jsx对象
const ele = (
  <div className='active' title='demo'>
    hello, <span>world</span>
  </div>
);

//函数组件
const Home = () => (
  <div className='active' title='demo'>
    hello, <span>world</span>
  </div>
);

// ReactDom.render(ele, document.querySelector('#root'));
ReactDom.render(<Home title={'demo'} />, document.querySelector('#root'));
