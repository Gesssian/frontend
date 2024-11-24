import {createSlice} from "@reduxjs/toolkit";

type T_ClimbersSlice = {
    climber_name: string
}

const initialState:T_ClimbersSlice = {
    climber_name: "",
}


const climbersSlice = createSlice({
    name: 'climbers',
    initialState: initialState,
    reducers: {
        updateClimberName: (state, action) => {
            state.climber_name = action.payload
        }
    }
})

export const { updateClimberName} = climbersSlice.actions;

export default climbersSlice.reducer