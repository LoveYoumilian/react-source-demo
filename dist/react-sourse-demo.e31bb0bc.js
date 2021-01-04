// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"React-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffNode = exports.diff = void 0;

var _index = require("./index");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var diff = function diff(dom, vNode, container) {
  var ret = diffNode(dom, vNode); //比较节点

  container && container.appendChild(ret);
  return ret;
};

exports.diff = diff;

var diffNode = function diffNode(dom, vNode) {
  var out = dom; //判断节点类型
  // 判断节点类型

  if (vNode === undefined || vNode === null || vNode === '' || typeof vNode === 'boolean') {
    return;
  }

  if (typeof vNode === 'number') {
    vNode = String(vNode);
  } //字符串


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
  } //如果是一个组件


  if (typeof vNode.tag === 'function') {
    return diffComponent(dom, vNode);
  } // 如果是非文本DOM节点
  // 真实DOM不存在


  if (!dom) {
    out = document.createElement(vNode.tag);
  } // 如果真实DOM存在,需要对比属性和对比子节点


  diffAttributes(out, vNode);

  if (vNode.children && vNode.children.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out, vNode.children);
  }

  return out;
};

exports.diffNode = diffNode;

var diffComponent = function diffComponent(dom, vNode) {
  var comp = dom; //如果组件没变化,则重新设置props

  if (comp && comp.constructor === vNode.tag) {
    //重新设置props
    (0, _index.setComponentProps)(comp, vNode.attr); //赋值

    dom = comp.base;
  } else {
    // 如果组件类型变化,则移除掉原来组件,并渲染新组件
    // 移除
    if (comp) {
      unmountComponent(comp);
      comp = null;
    } //核心代码
    // 1.创建新组件


    comp = (0, _index.createComponent)(vNode.tag, vNode.attr); // 2.设置组件属性

    (0, _index.setComponentProps)(comp, vNode.attr); // 挂载当前新的组件

    dom = comp.base;
  }

  return dom;
};

var diffAttributes = function diffAttributes(dom, vNode) {
  // 保存之前的真实DOM的所有属性
  var oldAttrs = {};
  var newAttrs = vNode.attr; //虚拟DOM的属性 (也是最新的属性)
  // 获取真实DOM属性

  var domAttrs = dom.attributes; // const domAttrs =  document.querySelector('#root').attributes;

  _toConsumableArray(domAttrs).forEach(function (item) {
    oldAttrs[item.name] = item.value;
  }); // 比较
  // 如果原来的属性不在新的属性当中,则将其移除掉  (属性值直接设置undefined)


  for (var key in oldAttrs) {
    if (!(key in newAttrs)) {
      // 移除
      (0, _index.setAttributeFunc)(dom, key, undefined);
    }
  } // 更新新的属性值


  for (var _key in newAttrs) {
    if (oldAttrs[_key] !== newAttrs[_key]) {
      console.log(dom, newAttrs[_key], _key); // 只更值不相等的属性

      (0, _index.setAttributeFunc)(dom, _key, newAttrs[_key]);
    }
  }
};

var diffChildren = function diffChildren(dom, vChildren) {
  var domChildren = dom.childNodes;
  var children = [];
  var keyed = {}; // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开

  if (domChildren.length > 0) {
    _toConsumableArray(domChildren).forEach(function (item) {
      // 获取key
      var key = item.key;

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
    var min = 0;
    var childrenLen = children.length; //2

    _toConsumableArray(vChildren).forEach(function (vChild, i) {
      // 获取虚拟DOM中所有的key
      var key = vChild.key;
      var child;

      if (key) {
        // 如果有key,找到对应key值的节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        // alert(1);
        // 如果没有key,则优先找类型相同的节点
        for (var j = min; j < childrenLen; j++) {
          var c = children[j];

          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      } // 对比


      child = diffNode(child, vChild); // 更新DOM

      var f = domChildren[i];

      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child); // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        } else if (child === f.nextSibling) {
          removeNode(f); // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
          dom.insertBefore(child, f);
        }
      }
    });
  }
};
},{"./index":"React-dom/index.js"}],"React-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.setAttributeFunc = exports.renderComponent = exports.unmountComponent = exports.setComponentProps = exports.createComponent = void 0;

var _component = _interopRequireDefault(require("../React/component"));

var _diff = require("./diff");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var createComponent = function createComponent(comp, props) {
  var inst; //  判断是类组件还是函数组件

  if (comp.prototype && comp.prototype.render) {
    //类组件
    inst = new comp(props);
  } else {
    //如果是函数,将函数组件扩展成类组件,方便后面统一处理
    inst = new _component.default(props);
    inst.constructor = comp; //将构造的对象construction的属性指向传进来的函数

    inst.render = function () {
      return inst.constructor(props);
    };
  }

  return inst;
};

exports.createComponent = createComponent;

var setComponentProps = function setComponentProps(comp, props) {
  //设置属性
  comp.props = props;

  if (!comp.base) {
    comp.componentWillMount && comp.componentWillMount();
  } else if (comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps();
  } //渲染节点


  renderComponent(comp);
};

exports.setComponentProps = setComponentProps;

var unmountComponent = function unmountComponent(dom) {
  console.log('移除组件');
  dom && dom.parentNode && dom.parentNode.removeNode(dom);
};

exports.unmountComponent = unmountComponent;

var renderComponent = function renderComponent(comp) {
  var base;
  var renderer = comp.render(); //返回jsx对象
  // base = _render(rendered); //返回节点对象

  base = (0, _diff.diffNode)(comp.base, renderer);

  if (comp.base) {
    comp.componentWillUpdate && comp.componentWillUpdate();
    comp.componentDidUpdate && comp.componentDidUpdate();
  } else if (comp.componentDidMount) {
    comp.componentDidMount();
  } // // 如果调用了setState,节点替换
  // if (comp.base && comp.base.parentNode) {
  //   comp.base.parentNode.replaceChild(base, comp.base);
  // }


  comp.base = base;
};
/* const _render = (vNode) => {
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
}; */


exports.renderComponent = renderComponent;

var render = function render(node, container, dom) {
  // return container.appendChild && container.appendChild(_render(node));
  return (0, _diff.diff)(dom, node, container);
};

var setAttributeFunc = function setAttributeFunc(dom, key, value) {
  // 判断key的类型
  // 如果key是类名直接转换成class
  if (key === 'className') {
    key = 'class';
  } // 1是事件 如onClick,onBlur...


  if (/on\w+/.test(key)) {
    key = key.toLowerCase();
    dom[key] = value || '';
  } else if (key === 'style') {
    // 2是样式 style
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (_typeof(value) === 'object') {
      //样式是对象
      for (var k in value) {
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

exports.setAttributeFunc = setAttributeFunc;
var ReactDOM = {
  render: render
};
var _default = ReactDOM;
exports.default = _default;
},{"../React/component":"React/component.js","./diff":"React-dom/diff.js"}],"React/set_state_queue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enqueueSetState = void 0;

var _index = require("../React-dom/index");

var setStateQueue = []; //修改的队列

var renderQueue = []; //渲染的组件
//创建队列
//队列 :先进先出

var defer = function defer(fn) {
  return Promise.resolve().then(fn);
}; // 定义一个flush方法,它的作用就是清空队列


var flush = function flush() {
  var item, comPonent; //遍历state

  while (item = setStateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        component = _item.component; // 如果没有preState,则当前的state作为初始的preState

    if (!component.preState) {
      component.preState = Object.assign({}, component.state);
    } // 如果stateChange是一个方法,也就是setState的第一种形式


    if (typeof stateChange === 'function') {
      Object.assign(component.state, stateChange(component.preState, component.props));
    } else {
      // 如果stateChange是一个对象,则直接合并到setState中
      Object.assign(component.state, stateChange);
    }

    component.prevState = component.state;
  } // 遍历组件


  while (comPonent = renderQueue.shift()) {
    (0, _index.renderComponent)(comPonent);
  }
};

var enqueueSetState = function enqueueSetState(stateChange, component) {
  console.log('component', component); // 如果setStateQueue的长度是0,也就是在上次flush执行之后第一次往队列里添加

  if (setStateQueue.length === 0) {
    defer(flush);
  } //入队 让所有设置的状态 都放入到队列中


  setStateQueue.push({
    stateChange: stateChange,
    component: component
  }); // 如果renderQueue里没有当前组件,则添加到队列中

  var r = renderQueue.some(function (item) {
    return item === component;
  });

  if (!r) {
    renderQueue.push(component);
  }
};

exports.enqueueSetState = enqueueSetState;
},{"../React-dom/index":"React-dom/index.js"}],"React/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _set_state_queue = require("./set_state_queue");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.props = props;
    this.state = {};
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(newValue) {
      // Object.assign(this.state, newValue);
      // renderComponent(this);
      (0, _set_state_queue.enqueueSetState)(newValue, this);
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{"./set_state_queue":"React/set_state_queue.js"}],"React/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createElement = function createElement(tag) {
  var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attr: attr,
    children: children,
    key: attr && attr.key || null
  };
};

var _default = {
  createElement: createElement,
  Component: _component.default
};
exports.default = _default;
},{"./component":"React/component.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireDefault(require("./React/index"));

var _index2 = _interopRequireDefault(require("./React-dom/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// import Component from './React/component';
//普通的jsx对象
var ele = _index.default.createElement("div", {
  className: "active",
  title: "demo"
}, "hello, ", _index.default.createElement("span", null, "world")); //函数组件


var Home = function Home() {
  return _index.default.createElement("div", {
    className: "active",
    title: "demo"
  }, "hello, ", _index.default.createElement("span", null, "world"));
}; // 类组件
// console.log('React',React)


var Demo = /*#__PURE__*/function (_React$Component) {
  _inherits(Demo, _React$Component);

  var _super = _createSuper(Demo);

  function Demo(props) {
    var _this;

    _classCallCheck(this, Demo);

    _this = _super.call(this, props);
    _this.state = {
      number: 0
    }; // this.numberAdd = this.numberAdd.bind(this);

    return _this;
  }

  _createClass(Demo, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      console.log('虚拟dom');
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      console.log('接收属性');
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      console.log('dom将要更新');
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log('dom已更新');
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('dom挂载');
    }
  }, {
    key: "numberAdd",
    value: function numberAdd() {
      this.setState({
        number: this.state.number + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      console.log('对对对111', this);
      return _index.default.createElement("div", {
        className: "active",
        title: "demo"
      }, "hello, ", _index.default.createElement("span", null, "world ", this.state.number), _index.default.createElement("button", {
        onClick: function onClick() {
          console.log(_this2);

          _this2.numberAdd();
        }
      }, "\u70B9\u51FB+"));
    }
  }]);

  return Demo;
}(_index.default.Component); // ReactDom.render(ele, document.querySelector('#root'));
// ReactDom.render(<Home title={'demo'} />, document.querySelector('#root'));


_index2.default.render(_index.default.createElement(Demo, {
  title: 'demo'
}), document.querySelector('#root'));
},{"./React/index":"React/index.js","./React-dom/index":"React-dom/index.js"}],"node_modules/_parcel-bundler@1.12.4@parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60861" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/_parcel-bundler@1.12.4@parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/react-sourse-demo.e31bb0bc.js.map