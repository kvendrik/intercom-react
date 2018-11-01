// eslint-disable-next-line import/no-extraneous-dependencies
import 'babel-polyfill';
import * as React from 'react';
import {render} from 'react-dom';

import Playground from './Playground';

render(<Playground />, document.getElementById('app'));
