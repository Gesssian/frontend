import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Climber, T_ClimbersListResponse} from "src/utils/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {saveExpedition} from "store/slices/expeditionsSlice.ts";
import {api} from "modules/api.ts";
import {AxiosResponse} from "axios";

type T_ClimbersSlice = {
    climber_name: string
    selectedClimber: null | T_Climber
    climbers: T_Climber[]
}

const initialState:T_ClimbersSlice = {
    climber_name: "",
    selectedClimber: null,
    climbers: []
}

export const fetchClimber = createAsyncThunk<T_Climber, string, AsyncThunkConfig>(
    "fetch_climber",
    async function(id) {
        const response = await api.climbers.climbersRead(id) as AxiosResponse<T_Climber>
        return response.data
    }
)

export const fetchClimbers = createAsyncThunk<T_Climber[], object, AsyncThunkConfig>(
    "fetch_climbers",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState();
        const response = await api.climbers.climbersList({
            climber_name: state.climbers.climber_name
        }) as AxiosResponse<T_ClimbersListResponse>

        thunkAPI.dispatch(saveExpedition({
            draft_expedition_id: response.data.draft_expedition_id,
            climbers_count: response.data.climbers_count
        }))

        return response.data.climbers
    }
)

export const addClimberToExpedition = createAsyncThunk<void, string, AsyncThunkConfig>(
    "climbers/add_climber_to_expedition",
    async function(climber_id) {
        await api.climbers.climbersAddToExpeditionCreate(climber_id)
    }
)

const climbersSlice = createSlice({
    name: 'climbers',
    initialState: initialState,
    reducers: {
        updateClimberName: (state, action) => {
            state.climber_name = action.payload
        },
        removeSelectedClimber: (state) => {
            state.selectedClimber = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchClimbers.fulfilled, (state:T_ClimbersSlice, action: PayloadAction<T_Climber[]>) => {
            state.climbers = action.payload
        });
        builder.addCase(fetchClimber.fulfilled, (state:T_ClimbersSlice, action: PayloadAction<T_Climber>) => {
            state.selectedClimber = action.payload
        });
    }
})

export const { updateClimberName, removeSelectedClimber} = climbersSlice.actions;

export default climbersSlice.reducer