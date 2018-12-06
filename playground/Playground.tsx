import * as React from 'react';
import {bind} from 'lodash-decorators';
import Intercom from '../src';

interface State {
  open: boolean;
}

export default class Playground extends React.PureComponent<{}, State> {
  state = {
    open: false,
  };

  render() {
    const {open} = this.state;
    return (
      <>
        <button onClick={this.openIntercom}>Open</button>
        <Intercom appId="fyq3wodw" open={open} onClose={this.closeIntercom} />
      </>
    );
  }

  @bind()
  private openIntercom() {
    this.setState({open: true});
  }

  @bind()
  private closeIntercom() {
    this.setState({open: false});
  }
}
