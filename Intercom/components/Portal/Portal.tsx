import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface Props {
  children: React.ReactNode;
}

export default class Portal extends React.PureComponent<Props, never> {
  render() {
    const {children} = this.props;
    return ReactDOM.createPortal(children, document.body);
  }
}
