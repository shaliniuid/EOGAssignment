import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import metricsSaga from '../Features/Metrics/saga';


export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(metricsSaga);
}
