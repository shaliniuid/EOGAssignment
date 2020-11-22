import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core";
import { useQuery } from "urql";
import { actions } from "../reducer";
import { useDispatch } from "react-redux";

type QueryResponse = {
    getLastKnownMeasurement: {
        value: number;
    }
}

type Args = {
    metricName: string
}

const MetricCard: React.FC<{ metricName: string; currentValue: number; }> = (props) => {
    const { metricName, currentValue } = props;
    // For initial value till the live updates
    const [value, setValue] = useState(currentValue);
    const [{ data, error }] = useQuery<QueryResponse, Args>({
        query: `query ($metricName: String!) {
            getLastKnownMeasurement(metricName:$metricName){
              metric
              value
              at
              unit
            }
          }`,
        variables: {
            metricName
        }
    });
    const dispatch = useDispatch();
    useEffect(() => {
        if (error) {
            dispatch(actions.metricsApiErrorReceived({ error: error.message }));
            return;
        }
        if (!data) return;
    }, [dispatch, data, error]);
    useEffect(() => setValue(data ? data.getLastKnownMeasurement.value : 0), [data])

    return <Grid item md={5} xs={6}>
        <Card elevation={2}>
            <CardHeader title={metricName} />
            <CardContent>
                <Typography variant="h3">
                    {currentValue ? currentValue : value}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
}

export default MetricCard;