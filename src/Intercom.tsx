import * as React from 'react';
import {bind} from 'lodash-decorators';
import {
  getIntercomFromFrame,
  objectEqual,
  classNames,
  IntercomType,
  injectCustomStyles,
} from './utilities';
import {
  ImportIsolatedRemote,
  BorderlessFrameListener,
  BorderlessFrameSizes,
} from './components';
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
  launcher?: boolean;
  onOpen?(): void;
  onClose?(): void;
  onUnreadCountChange?(unreadCount: number): void;
  onInitialization?(intercom: IntercomType): void;
}

interface FakeState {
  open?: boolean;
  animating?: boolean;
  borderlessFrameSizes?: BorderlessFrameSizes | null;
}

export interface State {
  frame: HTMLIFrameElement | null;
}

const ANIMATION_DURATION = 300;

class Intercom extends React.PureComponent<Props, State> {
  static defaultProps: Partial<Props> = {
    launcher: true,
  };

  state: State = {
    frame: null,
  };

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
    const {appId, launcher} = this.props;
    const {frame} = this.state;
    const importUrl = `https://widget.intercom.io/widget/${appId}`;

    const borderlessFrameListener = frame && (
      <BorderlessFrameListener
        frame={frame}
        onSizesUpdate={this.handleBorderlessFrameSizesUpdate}
        launcher={Boolean(launcher)}
      />
    );

    return (
      <>
        <ImportIsolatedRemote
          title="intercom"
          source={importUrl}
          onImported={this.initializeIntercom}
        />
        {borderlessFrameListener}
      </>
    );
  }

  private updateState({
    open = false,
    animating = false,
    borderlessFrameSizes = null,
  }: FakeState) {
    const {launcher} = this.props;
    const {frame} = this.state;

    if (!frame) {
      return;
    }

    if (borderlessFrameSizes) {
      const {width, height} = borderlessFrameSizes;
      frame.setAttribute('style', `width: ${width}; height: ${height};`);
    } else {
      frame.removeAttribute('style');
    }

    const className = classNames(
      styles.Intercom,
      launcher && styles.IntercomHasLauncher,
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
    this.setState({frame});

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

    if (open) {
      intercom('show');
    } else {
      this.updateState({open: false, animating: false});
    }

    this.injectCustomLauncherStyles();

    if (onInitialization) {
      onInitialization(intercom);
    }
  }

  private getIntercom() {
    const {frame} = this.state;
    if (!frame) {
      return () => {};
    }
    return getIntercomFromFrame(frame);
  }

  private injectCustomLauncherStyles() {
    const {frame} = this.state;
    injectCustomStyles(
      frame!,
      `
      .intercom-launcher-frame-shadow {
        box-shadow: none !important;
      }
    `,
    );
  }

  @bind()
  private handleBorderlessFrameSizesUpdate(
    borderlessFrameSizes: BorderlessFrameSizes,
  ) {
    this.updateState({borderlessFrameSizes});
  }
}

export default Intercom;
