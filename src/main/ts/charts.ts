import bb, { area, zoom } from "billboard.js";
import { GeneralDatum } from "./utils";
import { timeFormat } from "d3-time-format";

const tooltipDateFormat = timeFormat("%Y-%m-%d %H:%M");

let datum: GeneralDatum[];

export interface SeriesConfig {
	propName?: string;
	displayName?: string;
	scale?: number;
}

export function renderCharts(
	data: Iterable<GeneralDatum>,
	config?: SeriesConfig
) {
	datum = Array.from(data);
	generateChart(config);
}

function seriesConfig(config?: SeriesConfig): Required<SeriesConfig> {
	return {
		propName: config?.propName || "wattHours",
		displayName: config?.displayName || "Energy (kWh)",
		scale: 1000 / (config?.scale || 1),
	};
}

function generateChart(config?: SeriesConfig) {
	const c = seriesConfig(config);
	bb.generate({
		data: {
			json: datum,
			keys: {
				x: "date",
				value: [c.propName],
			},
			type: area(),
		},
		axis: {
			x: {
				type: "timeseries",
				tick: {
					count: 6,
					fit: false,
					format: "%Y-%m-%d %H:%M",
				},
				padding: {
					left: 20,
					right: 10,
					unit: "px",
				},
			},
			y: {
				label: c.propName,
				tick: {
					format: function (v: number) {
						return v / c.scale;
					},
				},
			},
		},
		legend: {
			hide: true,
		},
		zoom: {
			enabled: zoom(),
			type: "drag",
		},
		tooltip: {
			format: {
				title: tooltipDateFormat,
				name: () => "Example Chart",
			},
		},
		point: {
			focus: {
				only: true,
			},
		},
		bindto: "#chart",
	});
}
