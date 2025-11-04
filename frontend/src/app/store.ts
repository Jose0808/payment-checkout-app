import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import productReducer from '@features/product/productSlice'
import checkoutReducer from '@features/checkout/checkoutSlice'
import paymentReducer from '@features/payment/paymentSlice'
import transactionReducer from '@features/transaction/transactionSlice'

const rootReducer = combineReducers({
    product: productReducer,
    checkout: checkoutReducer,
    payment: paymentReducer,
    transaction: transactionReducer,
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['checkout', 'transaction'], // Solo persistir checkout y transaction
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
