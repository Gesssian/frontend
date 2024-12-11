import {configureStore, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "./slices/userSlice.ts"
import expeditionsReducer from "./slices/expeditionsSlice.ts"
import climbersReducer from "./slices/climbersSlice.ts"

export const store = configureStore({
    reducer: {
        user: userReducer,
        expeditions: expeditionsReducer,
        climbers: climbersReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;