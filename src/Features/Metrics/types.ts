import { OptionTypeBase } from "react-select"

export interface SelectedMetricPayload {
    selected: string[];
    metricName: string;
}

export interface Metric {
    metric: string;
    at: string;
    value: number;
    unit: string;
}

export interface MetricsWithCardsValue {
    metrics: {
        [at: string]: Metric;
    };
    cardsValue: {
        [metric: string]: number
    }
}

export interface State {
    metrics: {
        [at: string]: Metric;
    };
    cardsValue: {
        [metric: string]: number
    },
    selected: string[];
}
export interface Option extends OptionTypeBase {
    label: string;
    value: string;
}

export interface MetricsDataPayload {
    metrics: {
        [at: string]: Metric;
    };
}

