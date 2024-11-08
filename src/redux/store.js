import { createStore } from 'redux';
import rootReducer from './reducer';
import { persistStore, persistReducer } from 'redux-persist';
import persistConfig from './persistConfig';

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
