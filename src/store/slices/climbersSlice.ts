import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Climber, T_ClimberAddData, T_ClimbersListResponse} from "modules/types.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import {saveExpedition} from "store/slices/expeditionsSlice.ts";
import {Climber} from "src/api/Api.ts";

type T_ClimbersSlice = {
    climber_name: string
    climber: null | T_Climber
    climbers: T_Climber[]
}

const initialState:T_ClimbersSlice = {
    climber_name: "",
    climber: null,
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

export const deleteClimber = createAsyncThunk<T_Climber[], string, AsyncThunkConfig>(
    "delete_climber",
    async function(climber_id) {
        const response = await api.climbers.climbersDeleteDelete(climber_id) as AxiosResponse<T_Climber[]>
        return response.data
    }
)

export const updateClimber = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_climber",
    async function({climber_id, data}) {
        await api.climbers.climbersUpdateUpdate(climber_id as string, data as Climber)
    }
)

export const updateClimberImage = createAsyncThunk<void, object, AsyncThunkConfig>(
    "update_climber_image",
    async function({climber_id, data}) {
        await api.climbers.climbersUpdateImageCreate(climber_id as string, data as {image?: File})
    }
)

export const createClimber = createAsyncThunk<void, T_ClimberAddData, AsyncThunkConfig>(
    "update_climber",
    async function(data) {
        await api.climbers.climbersCreateCreate(data)
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
            state.climber = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchClimbers.fulfilled, (state:T_ClimbersSlice, action: PayloadAction<T_Climber[]>) => {
            state.climbers = action.payload
        });
        builder.addCase(fetchClimber.fulfilled, (state:T_ClimbersSlice, action: PayloadAction<T_Climber>) => {
            state.climber = action.payload
        });
        builder.addCase(deleteClimber.fulfilled, (state:T_ClimbersSlice, action: PayloadAction<T_Climber[]>) => {
            state.climbers = action.payload
        });
    }
})

export const { updateClimberName, removeSelectedClimber} = climbersSlice.actions;

export default climbersSlice.reducer