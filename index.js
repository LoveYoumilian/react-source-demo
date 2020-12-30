import React from './React/index';
import ReactDom from './React-dom/index';
// import Component from './React/component';
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
// 类组件
// console.log('React',React)
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
    // this.numberAdd = this.numberAdd.bind(this);
  }
  componentWillMount() {
    console.log('虚拟dom');
  }
  componentWillReceiveProps() {
    console.log('接收属性');
  }
  componentWillUpdate() {
    console.log('dom将要更新');
  }
  componentDidUpdate() {
    console.log('dom已更新');
  }
  componentDidMount() {
    console.log('dom挂载');
  }
  numberAdd() {
    this.setState({
      number: this.state.number + 1,
    });
  }
  render() {
    console.log('对对对111', this);
    return (
      <div className='active' title='demo'>
        hello, <span>world {this.state.number}</span>
        <button
          onClick={() => {
            console.log(this);
            this.numberAdd();
          }}
        >
          点击+
        </button>
      </div>
    );
  }
}

// ReactDom.render(ele, document.querySelector('#root'));
// ReactDom.render(<Home title={'demo'} />, document.querySelector('#root'));
ReactDom.render(<Demo title={'demo'} />, document.querySelector('#root'));
