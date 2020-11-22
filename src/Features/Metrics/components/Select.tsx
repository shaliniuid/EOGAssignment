import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Select, { ActionMeta, OptionsType, ValueType } from "react-select";
import { useQuery } from "urql";
import { useDispatch } from "react-redux";
import { Option } from "../types";
import { actions } from "../reducer";

const MetricSelect: React.FC = () => {
    const [result] = useQuery<{ getMetrics: Array<string> }>({
        query: `
            query {
                getMetrics
            }
        `
    })
    const { data, error } = result;
    const [options, setOptions] = useState<OptionsType<Option>>([]);
    useEffect(() => {
        if (error || !data) return;
        const { getMetrics } = data;
        setOptions(getMetrics.map((option) => ({ label: option, value: option })))
    }, [data, error]);

    const dispatch = useDispatch();

    return <Grid container spacing={2} direction='row-reverse'>
        <Grid item xs={12} md={6} lg={5}>
            <Select
                name='metricSelect'
                options={options}
                isMulti
                closeMenuOnSelect={false}
                onChange={(selected: ValueType<Option>, action: ActionMeta<Option>) => dispatch(actions.metricSelected({
                    selected: (selected && selected.map((item: Option) => item.value)) || [],
                    metricName: (action.option && action.option.value) || ''
                }))}
            />
        </Grid>
    </Grid>
}

export default MetricSelect;