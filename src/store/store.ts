import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import climbersReducer from "./slices/climbersSlice.ts"

export const store = configureStore({
    reducer: {
        climbers: climbersReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;