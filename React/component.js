import { renderComponent } from '../React-dom';
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }

  setState(newValue) {
    Object.assign(this.state, newValue);
    renderComponent(this);
  }
}
export default Component;
