import React, { useEffect } from "react";
import { Provider, useSubscription } from 'urql';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import Select from './components/Select';
import client from './client';
import MetricCard from './components/MetricCard';
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../store";
import { Metric } from "./types";
import { actions } from "./reducer";
import Charts from "./components/Charts";

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        padding: theme.spacing(4)
    }
}))

interface SubscriptionResponse {
    newMeasurement: Metric
}

const Metrics: React.FC = () => {
    const classes = useStyles();
    const selectedMetrics = useSelector(({ metrics }: IState) => metrics.selected);
    const cardsValue = useSelector(({ metrics }: IState) => metrics.cardsValue);

    const dispatch = useDispatch();
    const [{ data, error }] = useSubscription<SubscriptionResponse>({
        query: `
        subscription {
            newMeasurement {
                at
                metric
                value
                unit
            }
        }`,
        pause: selectedMetrics.length === 0
    })
    useEffect(() => {
        if (error) {
            dispatch(actions.metricsApiErrorReceived({ error: error.message }));
        }
        data && dispatch(actions.newMetricFetched(data.newMeasurement))
    }, [data, dispatch, error])

    return <main className={classes.container}>
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Select />
                <Grid item lg={7} md={6} xs={12} spacing={2} container>
                {
                    selectedMetrics.map((metric) => (
                        <MetricCard key={metric}
                            metricName={metric}
                            currentValue={cardsValue[metric]}
                        />
                    ))
                }
                </Grid>
            </Grid>
            <Charts />
        </Grid>
    </main>
}

const MetricsWithProvider = () => {
    return <Provider value={client}>
        <Metrics />
    </Provider>
}

export default MetricsWithProvider;