import {IntercomWindow} from './types';

export default (frame: HTMLIFrameElement) =>
  (frame.contentWindow! as IntercomWindow).Intercom;
