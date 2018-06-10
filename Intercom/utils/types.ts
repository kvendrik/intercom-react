export type IntercomType = (command: string, callbackOrSettings?: any) => void;

export type IntercomWindow = Window & {
  Intercom: IntercomType;
};
