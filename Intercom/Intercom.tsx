import * as React from 'react';
import {Bind} from 'lodash-decorators';
import {
  getIntercomFromFrame,
  objectEqual,
  classNames,
  IntercomType,
} from './utils';
import {ImportIsolatedRemote} from './components';

import styles from './Intercom.scss';

/* eslint-disable camelcase */
export interface UserData {
  user_id?: string;
  email?: string;
  [key: string]: any;
}
/* eslint-enable camelcase */

export interface Props {
  appId: string;
  userData: UserData;
  open?: boolean;
  locationKey?: string;
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

  componentWillReceiveProps({
    open: nextOpen,
    locationKey: nextLocationKey,
    userData: nextUserData,
  }: Props) {
    const {userData, locationKey} = this.props;

    if (nextOpen) {
      this.getIntercom()('show');
    }

    if (
      nextLocationKey !== locationKey ||
      !objectEqual(userData, nextUserData)
    ) {
      this.getIntercom()('update', nextUserData);
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

  @Bind()
  private initializeIntercom(frame: HTMLIFrameElement) {
    const {
      open,
      onOpen,
      onClose,
      appId,
      onUnreadCountChange,
      userData,
      onInitialization,
    } = this.props;

    const intercom = getIntercomFromFrame(frame);

    intercom('boot', {
      app_id: appId,
      ...userData,
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
    intercom('onUnreadCountChange', onUnreadCountChange);

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
