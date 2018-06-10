# [WIP] intercom-react

An [Intercom](http://intercom.com/) component for React that truly encapsulates the library and makes it work like a "real" React component.

## Installation

```
yarn add intercom-react
```

## Setup

```tsx
<Intercom
  open
  appId="fyq3wodw"
  userData={{
    user_id: '9876',
    email: 'john.doe@example.com',
    created_at: 1234567890,
    name: 'John Doe',
  }}
  locationKey={this.props.location.pathname}
  onOpen={() => {}}
  onClose={() => {}}
  onUnreadCountChange={(unreadCount) => {}}
  onInitialization={(intercom) => {}}
>
```

* `open`: whether Intercom is showing or not.
* `appId`: the ID of your app.
* `userData`: all user data. If this changes during the lifecycle the component will call `intercom('update', userData)`.
* `locationKey`: (optional): a key for the component to detect if the location changes. If this changes during the lifecycle the component will call `intercom('update', userData)`.
* `onOpen` (optional): called when intercom opens.
* `onClose` (optional): called when intercom closes.
* `onUnreadCountChange` (optional): called when the unread count changes.
* `onInitialization` (optional): called when intercom has initialized. The component passes the `intercom` method to this callback in case you require advanced usage like [emitting events](https://developers.intercom.com/docs/intercom-javascript#section-intercomtrackevent) or [pre-populating content](https://developers.intercom.com/docs/intercom-javascript#section-intercomshownewmessage).

## How is this different?

Intercom is the support tool of choice for myself and the companies I work for. An issue I have always had with their library is that its not particularly React friendly. There is a set of React Intercom libraries out there but most of them just mount Intercom to the global scope.

What this means is that if you would get into a situation where you would have to unmount Intercom the three DOM nodes the library mounts (`#intercom-container`, `#intercom-stylesheet` and `#intercom-frame`) will stay mounted, as will the three event listeners the library mounts (2x `beforeunload` and 2x `message`). In other words the existing components are not unmountable.

I wrote this component to create am isolated Intercom component that truly cleans up after itself when unmounted for a "true" React experience.
