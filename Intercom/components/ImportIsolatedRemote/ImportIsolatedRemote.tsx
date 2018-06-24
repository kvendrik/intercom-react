import * as React from 'react';
import {Portal} from '..';
import * as styles from './ImportIsolatedRemote.scss';

export interface Props {
  title: string;
  source: string;
  onImported(frame: HTMLIFrameElement): void;
}

export default class ImportIsolatedRemote extends React.Component<
  Props,
  never
> {
  private frameNode: React.RefObject<HTMLIFrameElement> = React.createRef();
  private scriptNode: HTMLScriptElement | null = null;

  componentDidMount() {
    const {current: frame} = this.frameNode;
    const {source, onImported} = this.props;

    if (!frame || !frame.contentWindow) {
      return;
    }

    const {contentWindow} = frame;

    const script = document.createElement('script');
    script.src = source;
    this.scriptNode = script;

    frame.onload = () => {
      contentWindow.document.body.appendChild(script);
      script.onload = () => onImported(frame);
    };

    // some browsers don't trigger iframe.onload (like Safari 11.1.1)
    // this immediate page refresh fixes that
    contentWindow.location.reload();
  }

  componentWillUnmount() {
    const {scriptNode} = this;
    if (!scriptNode) {
      return;
    }
    scriptNode.onload = null;
  }

  render() {
    const {title} = this.props;
    return (
      <Portal>
        <iframe
          className={styles.ImportIsolatedRemote}
          title={title}
          ref={this.frameNode}
        />
      </Portal>
    );
  }
}
