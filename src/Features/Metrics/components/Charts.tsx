import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux"
import { Grid, makeStyles } from "@material-ui/core";
import { IState } from "../../../store";

type Unit = {
    enabled: boolean;
    value: string;
    dx: number,
    dy: number,
    angle: number,
    yAxisId: number,
    fontSize?: number,
    tickFormatter?: (value: number) => string;
}

const useStyles = makeStyles({
    graphContainer: {
        width: '90vw',
        height: '90vh',
    },
});

const getAxisID = (metric: string) => {
    if (metric.toLowerCase().endsWith('pressure')) {
        return 1
    } else if (metric.toLowerCase().endsWith('temp')) {
        return 2
    }
    return 0
}

const Charts: React.FC = () => {

    const COLORS = [
        '#00876c',
        '#64ad73',
        '#afd17c',
        '#fff18f',
        '#fbb862',
        '#d43d51',
    ];

    const selectedItems = useSelector((state: IState) => state.metrics.selected);

    const units: { [key: string]: Unit } = {
        percentage: {
            enabled: selectedItems.some((m: string) => getAxisID(m) === 0),
            value: '%',
            dx: 10,
            dy: 10,
            angle: -90,
            yAxisId: 0
        },
        pressure: {
            enabled: selectedItems.some((m: string) => getAxisID(m) === 1),
            value: 'PSI',
            dx: 10,
            dy: 10,
            angle: -90,
            fontSize: 12,
            yAxisId: 1,
            tickFormatter: (value: number): string => value >= 1000 ? `${value / 1000}K` : value.toString()
        },
        temperature: {
            enabled: selectedItems.some((m: string) => getAxisID(m) === 2),
            value: 'F',
            dx: 10,
            dy: 15,
            angle: -90,
            fontSize: 12,
            yAxisId: 2
        }
    }

    const metrics = useSelector((state: IState) => state.metrics.metrics);
    const classes = useStyles();
    const data = Object.keys(metrics).map(key => metrics[key])

    return <Grid container className={classes.graphContainer}>
        <ResponsiveContainer>
            <LineChart
                width={600}
                height={600}
                data={data}
            >
                {
                    selectedItems.map((metric, index) => {
                        return <Line
                            key={metric}
                            yAxisId={getAxisID(metric)}
                            dataKey={metric}
                            stroke={COLORS[index]}
                            dot
                            activeDot
                        />
                    })
                }
                {
                    selectedItems.length > 0 &&
                    <XAxis dataKey="at" interval={150} />
                }
                {
                    Object.keys(units).map((key) => {
                        const {
                            enabled,
                            yAxisId,
                            tickFormatter,
                            ...rest
                        } = units[key];
                        return enabled && <YAxis
                            key={key}
                            label={{ position: 'insideTopLeft', offset: 0, fill: '#908e8e', ...rest }}
                            yAxisId={yAxisId}
                            tickFormatter={tickFormatter}
                        />
                    })
                }
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    </Grid>
}

export default Charts;