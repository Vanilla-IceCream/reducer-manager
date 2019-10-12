import React from 'react';
import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import global from 'global';

export const createReducerManager = (initialReducers) => {
  const reducers = { ...initialReducers };

  let combinedReducer = combineReducers(reducers);
  let keysToRemove = [];

  return {
    reduce(state, action) {
      if (keysToRemove.length > 0) {
        state = { ...state };

        for (const key of keysToRemove) {
          delete state[key];
        }

        keysToRemove = [];
      }

      return combinedReducer(state, action);
    },
    add(key, reducer) {
      if (!key || reducers[key]) return;
      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers);
    },
    remove(key) {
      if (!key || !reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    },

  };
};

export const bindReducerManager = reducerManager => {
  global.reducerManager = reducerManager;
};

export const dynamic = (key, reducer) => WrappedComponent => {
  if (typeof key === 'string') {
    global.reducerManager.add(key, reducer);
  }

  if (Array.isArray(key)) {
    if (key.length === 2) {
      global.reducerManager.add(key[0], combineReducers({ [key[1]]: reducer }));
    }

    if (key.length === 3) {
      global.reducerManager.add(
        key[0],
        combineReducers({
          [key[1]]: combineReducers({ [key[2]]: reducer }),
        }),
      );
    }
  }

  const Dynamic = (props) => {
    const dispatch = useDispatch();
    dispatch({ type: '@@redux/INIT' });
    return <WrappedComponent {...props} />;
  };

  return Dynamic;
};
