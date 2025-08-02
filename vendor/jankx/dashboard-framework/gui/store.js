import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epics';

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export default store;