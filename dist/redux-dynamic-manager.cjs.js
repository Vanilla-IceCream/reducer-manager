'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var redux = require('redux');
var reactRedux = require('react-redux');
var global = _interopDefault(require('global'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty = _defineProperty;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var createReducerManager = function createReducerManager(initialReducers) {
  var reducers = _objectSpread({}, initialReducers);

  var combinedReducer = redux.combineReducers(reducers);
  var keysToRemove = [];
  return {
    getReducerMap: function getReducerMap() {
      return reducers;
    },
    reduce: function reduce(state, action) {
      if (keysToRemove.length > 0) {
        state = _objectSpread({}, state);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = keysToRemove[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;
            delete state[key];
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        keysToRemove = [];
      }

      return combinedReducer(state, action);
    },
    add: function add(key, reducer) {
      if (!key || reducers[key]) return;
      reducers[key] = reducer;
      combinedReducer = redux.combineReducers(reducers);
    },
    remove: function remove(key) {
      if (!key || !reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = redux.combineReducers(reducers);
    }
  };
};
var bindReducerManager = function bindReducerManager(reducerManager) {
  global.reducerManager = reducerManager;
};
var dynamic = function dynamic(key, reducer) {
  return function (WrappedComponent) {
    if (typeof key === 'string') {
      global.reducerManager.add(key, reducer);
    }

    if (Array.isArray(key)) {
      if (key.length === 2) {
        global.reducerManager.add(key[0], redux.combineReducers(defineProperty({}, key[1], reducer)));
      }

      if (key.length === 3) {
        global.reducerManager.add(key[0], redux.combineReducers(defineProperty({}, key[1], redux.combineReducers(defineProperty({}, key[2], reducer)))));
      }
    }

    var Dynamic = function Dynamic(props) {
      var dispatch = reactRedux.useDispatch();
      dispatch({
        type: '@@redux/INIT'
      });
      return React.createElement(WrappedComponent, props);
    };

    return Dynamic;
  };
};

exports.bindReducerManager = bindReducerManager;
exports.createReducerManager = createReducerManager;
exports.dynamic = dynamic;
//# sourceMappingURL=redux-dynamic-manager.cjs.js.map
