import ChartType from './chart/chart-type'
import LineChart from './chart/line-chart'
import SimpleXYLineChart from './chart/simple-xy-line-chart'
import StepChart from './_/step-chart'
import BarChart from './_/bar-chart'
import PieChart from './_/pie-chart'
import CombinationChart from './_/combination-chart'
import MultipleXYLineChart from './_/multiple-xy-line-chart'
import AreaChart from './_/area-chart'
import StackedBarChart from './_/stacked-bar-chart'
import DonutChart from './_/donut-chart'
import SplineChart from './chart/spline-chart'
import LineChartWithRegions from './_/line-chart-with-regions'
import StackedAreaChart from './_/stacked-area-chart'
import ScatterPlot from './_/scatter-plot'
import GaugeChart from './_/gauge-chart'
import InvalidGrammarError from './error/invalid-grammar-error'

export default class Graph {

	// generate <graph_type> for <datasource>
	constructor(grammar) {
		this._chart = undefined

		// Validate and parse the grammar
		let grammarParser = new GrammarParser(grammar)

		let chartType = grammarParser.chartType
		switch (ChartType.enumValueOf(chartType)) {
		case ChartType.LINE_CHART:
			this._chart = new LineChart(grammarParser.datasource)
			break

		case ChartType.SIMPLE_XY_LINE_CHART:
			this._chart = new SimpleXYLineChart(grammarParser.datasource)
			break

		case ChartType.STEP_CHART:
			this._chart = new StepChart()
			break

		case ChartType.BAR_CHART:
			this._chart = new BarChart()
			break

		case ChartType.PIE_CHART:
			this._chart = new PieChart()
			break

		case ChartType.COMBINATION_CHART:
			this._chart = new CombinationChart()
			break

		case ChartType.MULTIPLE_XY_LINE_CHART:
			this._chart = new MultipleXYLineChart()
			break

		case ChartType.AREA_CHART:
			this._chart = new AreaChart()
			break

		case ChartType.STACKED_BAR_CHART:
			this._chart = new StackedBarChart()
			break

		case ChartType.DONUT_CHART:
			this._chart = new DonutChart()
			break

		case ChartType.SPLINE_CHART:
			this._chart = new SplineChart(grammarParser.datasource)
			break

		case ChartType.LINE_CHART_WITH_REGIONS:
			this._chart = new LineChartWithRegions()
			break

		case ChartType.STACKED_AREA_CHART:
			this._chart = new StackedAreaChart()
			break

		case ChartType.SCATTER_PLOT:
			this._chart = new ScatterPlot()
			break

		case ChartType.GAUGE_CHART:
			this._chart = new GaugeChart()
			break
		}
	}

	do(grammar) {
		return this._chart.do(grammar)
	}

	generateJson() {
		return this._chart.generateJson()
	}
}

class GrammarParser {

	constructor(grammar) {
		this.grammar = grammar
		this.chartType = undefined
		this.datasource = undefined

		// Verify the basic structure of the grammar
		if (GrammarParser.verifyStructure(grammar)) {
			let chartTypeExtract = grammar.match(new RegExp('generate [A-Z_]+ for'))[0]
			this.chartType = chartTypeExtract.slice(9, chartTypeExtract.length - 4)
			this.datasource = grammar.match(new RegExp('for {.*}'))[0].slice(4)

			// Verify the chart type and the datasource
			if (!GrammarParser.verifyChartType(this.chartType) || !GrammarParser.verifyDatasource(this.datasource)) {
				throw new InvalidGrammarError()
			}
		} else {
			throw new InvalidGrammarError()
		}
	}

	static verifyStructure(grammar) {
		return grammar.match(new RegExp('generate [A-Z_]+ for {.*}'))
	}

	static verifyChartType(chartType) {
		return ChartType.enumValueOf(chartType) instanceof ChartType
	}

	// eslint-disable-next-line no-unused-vars
	static verifyDatasource(grammar) {
		// TODO : Verify datasource
		return true
	}
}