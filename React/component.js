// import { renderComponent } from '../React-dom';
import { enqueueSetState } from './set_state_queue'
class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
  }

  setState(newValue) {
    // Object.assign(this.state, newValue);
    // renderComponent(this);
    enqueueSetState(newValue,this)
  }
}
export default Component;
