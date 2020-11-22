import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction } from '../Weather/reducer';
import {
    Metric,
    State,
    MetricsWithCardsValue,
    SelectedMetricPayload,
    MetricsDataPayload
} from './types';

const initialState: State = {
    selected: [],
    metrics: {},
    cardsValue: {},
};

const slice = createSlice({
    initialState,
    name: 'metricsReducer',
    reducers: {
        newMetricFetched: (state, action: PayloadAction<Metric>) => state,

        metricSelected: (state, action: PayloadAction<SelectedMetricPayload>) => ({
            ...state,
            selected: action.payload.selected
        }),

        metricDataReceived: (state, action: PayloadAction<MetricsWithCardsValue>) => ({
            ...state,
            metrics: action.payload.metrics,
            cardsValue: action.payload.cardsValue
        }),

        multipleMetricsDataReceived: (state, action: PayloadAction<MetricsDataPayload>) => ({
            ...state,
            metrics: action.payload.metrics,
        }),

        metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,

    }
})

export const { reducer, actions } = slice;