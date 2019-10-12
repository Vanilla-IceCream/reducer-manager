# Redux Dynamic Manager

Modularize Redux by dynamically loading reducers.

## Installation and Usage

```bash
$ npm i redux-dynamic-manager -S
# or
$ yarn add redux-dynamic-manager
```

```js
// for commonjs
const { createReducerManager, bindReducerManager, dynamic } = require('redux-dynamic-manager');

// for es modules
import { createReducerManager, bindReducerManager, dynamic } from 'redux-dynamic-manager';
```

## Getting Started

### Configure Store

```js
import { createStore, applyMiddleware, compose } from 'redux';
import { createReducerManager, bindReducerManager, dynamic } from 'redux-dynamic-manager';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';

import appReducer from '~/reducer';

import { history } from './Router';

const rootReducer = {
  app: appReducer,
  router: connectRouter(history),
};

const reducerManager = createReducerManager(rootReducer);

bindReducerManager(reducerManager);

export const configureStore = () => {
  const composeEnhancer =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    reducerManager.reduce,
    composeEnhancer(
      applyMiddleware(routerMiddleware(history), thunkMiddleware),
    ),
  );

  return store;
};
```

### Load Component

```js
import React from 'react';

const HelloWorld = React.lazy(() => import('./HelloWorld'));
```

```js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { dynamic } from 'redux-dynamic-manager';
import styled from '@emotion/styled';

import reducer from './reducer';

const Title = styled('h1')`
  color: #222222;
`;

const HelloWorld = () => {
  const [world] = useState('World');
  const { hello } = useSelector(state => state.helloWorld);

  return (
    <div id="hello-world">
      <Title>{hello}, {world}!</Title>
    </div>
  );
};

export default dynamic('helloWorld', reducer)(HelloWorld);

// before:
// {
//   "app": ...,
//   "router": ...
// }

// after:
// {
//   "app": ...,
//   "router": ...,
//   "helloWorld": ...
// }
```

Nested modules:

```js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { dynamic } from 'redux-dynamic-manager';
import styled from '@emotion/styled';

import reducer from './reducer';

const Title = styled('h1')`
  color: #222222;
`;

const HelloWorld = () => {
  const [world] = useState('World');
  const { hello } = useSelector(state => state.helloWorld);

  return (
    <div id="hello-world">
      <Title>{hello}, {world}!</Title>
    </div>
  );
};

export default dynamic(['hello', 'world'], reducer)(HelloWorld);

// before:
// {
//   "app": ...,
//   "router": ...
// }

// after:
// {
//   "app": ...,
//   "router": ...,
//   "hello": {
//     "world": ...
//   }
// }
```
