import { takeEvery, put, select, fork, call } from 'redux-saga/effects'
import { actions } from './reducer';
import { Metric, SelectedMetricPayload } from './types'
import { PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import { OperationResult } from 'urql';
import client from './client';
import { toast } from 'react-toastify';
import { ApiErrorAction } from '../Weather/reducer';

type Metrics = {
    [time: string]: Metric;
}

type CardsValue = {
    [metric: string]: number
}

const getTimeKey = (time: string) => {
    const hours = new Date(time).getHours() % 12 || 12;
    const minutes = new Date(time).getMinutes()
    const timeAt = `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`
    return timeAt
}

function* convertSaga(action: PayloadAction<Metric>) {
    const { payload: { metric, at, value } } = action;
    const data: Metrics = yield select((state: IState) => state.metrics.metrics);
    const timeAt = getTimeKey(at);
    const metrics = {
        ...data,
        [at]: {
            ...data[at],
            [metric]: value,
            at: timeAt,
        },
    };
    const previousCardValue: CardsValue = yield select((state: IState) => state.metrics.cardsValue)
    const cardsValue = {
        ...previousCardValue,
        [metric]: value
    }
    yield put(actions.metricDataReceived({ metrics, cardsValue }))
}

type Response = {
    getMeasurements: Metric[]
}

type Args = {
    metricName: string;
    after: number
}

function* mergeMetrics(listOfMetrics?: Array<Metric>) {
    let metrics: { [at: string]: Metric } = yield select((state: IState) => state.metrics.metrics);
    listOfMetrics && listOfMetrics.map(item => {
        const { metric, at, value } = item;
        const hrs = new Date(at).getHours() % 12 || 12;
        const mins = new Date(at).getMinutes()
        const timeAt = `${("0" + hrs).slice(-2)}:${("0" + mins).slice(-2)}`
        metrics = {
            ...metrics,
            [at]: {
                ...metrics[at],
                [metric]: value,
                at: timeAt,
            },
        }
        return metric
    })
    yield put(actions.multipleMetricsDataReceived({ metrics }))
}

function* fetchPreviousData({ payload }: PayloadAction<SelectedMetricPayload>) {
    const getTimeBefore = (durationInMinutes: number) => new Date(new Date().getTime() - durationInMinutes * 60000).getTime()
    const after = getTimeBefore(30)
    const { data, error }: OperationResult<Response> = yield client.query<Response, Args>(`
    query($metricName: String!, $after: Timestamp) {
        getMeasurements(input: { metricName: $metricName, after: $after }) {
            at
            metric
            value
            unit
        }
    }`, { metricName: payload.metricName, after }).toPromise();
    console.log('data', data)
    if (error) {
        yield put(actions.metricsApiErrorReceived({ error: error.message }));
        return;
    }
    yield fork(mergeMetrics, data && data.getMeasurements)
}

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
    yield call(toast.error, `Error Received: ${action.payload.error}`);
}

export default function* watcher() {
    yield takeEvery(actions.newMetricFetched.type, convertSaga);
    yield takeEvery(actions.metricSelected.type, fetchPreviousData);
    yield takeEvery(actions.metricsApiErrorReceived.type, apiErrorReceived);
}