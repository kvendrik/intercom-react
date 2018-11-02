import * as React from 'react';
import {bind} from 'lodash-decorators';
import {
  getIntercomFromFrame,
  objectEqual,
  classNames,
  IntercomType,
} from './utilities';
import {ImportIsolatedRemote} from './components';

import * as styles from './Intercom.scss';

/* eslint-disable camelcase */
export interface User {
  user_id?: string;
  email?: string;
  [key: string]: any;
}
/* eslint-enable camelcase */

export interface Props {
  appId: string;
  user?: User;
  open?: boolean;
  onOpen?(): void;
  onClose?(): void;
  onUnreadCountChange?(unreadCount: number): void;
  onInitialization?(intercom: IntercomType): void;
}

interface FakeState {
  open: boolean;
  animating: boolean;
}

const ANIMATION_DURATION = 300;

export default class Intercom extends React.PureComponent<Props, never> {
  private frame: HTMLIFrameElement | null = null;

  componentWillReceiveProps({open: nextOpen, user: nextUser}: Props) {
    const {user} = this.props;

    if (nextOpen) {
      this.getIntercom()('show');
    }

    if (nextUser && !objectEqual(user || {}, nextUser)) {
      this.getIntercom()('update', nextUser);
    }
  }

  componentWillUnmount() {
    this.getIntercom()('shutdown');
  }

  render() {
    const {appId} = this.props;
    const importUrl = `https://widget.intercom.io/widget/${appId}`;
    return (
      <ImportIsolatedRemote
        title="intercom"
        source={importUrl}
        onImported={this.initializeIntercom}
      />
    );
  }

  private updateState({open, animating}: FakeState) {
    const {frame} = this;

    if (!frame) {
      return;
    }

    const className = classNames(
      styles.Intercom,
      open && styles.IntercomOpen,
      animating && styles.IntercomAnimating,
    );

    frame.setAttribute('class', className);
  }

  @bind()
  private initializeIntercom(frame: HTMLIFrameElement) {
    const {
      open,
      onOpen,
      onClose,
      appId,
      onUnreadCountChange,
      user,
      onInitialization,
    } = this.props;

    const intercom = getIntercomFromFrame(frame);

    intercom('boot', {
      app_id: appId,
      ...user,
    });

    intercom('onShow', () => {
      this.updateState({open: true, animating: false});
      if (onOpen) {
        onOpen();
      }
    });
    intercom('onHide', () => {
      this.updateState({open: true, animating: true});
      setTimeout(
        () => this.updateState({open: false, animating: false}),
        ANIMATION_DURATION,
      );
      if (onClose) {
        onClose();
      }
    });

    if (onUnreadCountChange) {
      intercom('onUnreadCountChange', onUnreadCountChange);
    }

    this.frame = frame;

    if (open) {
      intercom('show');
    } else {
      this.updateState({open: false, animating: false});
    }

    if (onInitialization) {
      onInitialization(intercom);
    }
  }

  private getIntercom() {
    const {frame} = this;
    if (!frame) {
      return () => {};
    }
    return getIntercomFromFrame(frame);
  }
}
