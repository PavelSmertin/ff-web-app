
<template>

	<svg class="tt_graph_component" ref="graphWrap">
		<defs>
			<linearGradient id="GradientFirst" x1="0" x2="0" y1="0" y2="5">
				<stop offset="0%" stop-color="#8FCC14"/>
				<stop offset="25%" stop-color="#8FCC14" stop-opacity="0"/>
			</linearGradient>
			<linearGradient id="GradientSecond" x1="0" x2="0" y1="0" y2="5">
				<stop offset="0%" stop-color="#999999"/>
				<stop offset="35%" stop-color="#999999" stop-opacity="0"/>
			</linearGradient>
		</defs>

		<svg ref="graph" :viewBox="viewBox" preserveAspectRatio="none" @mousemove="mouseover" @mouseleave="mouseleave">
			<rect :width="graphWidth" :height="graphHeight" fill-opacity="0" stroke-opacity="0" />
			<svg y="30%">
				<g transform="scale(1, 0.65)">
					<path v-bind="bindSecondLine()" class="linePrice" ref="linePrice" vector-effect="non-scaling-stroke" />
					<path v-bind="bindSecondArea()" class="areaPrice" vector-effect="non-scaling-stroke" />
					<path v-bind="bindFirstLine()" class="linePart" ref="linePart" vector-effect="non-scaling-stroke" />
					<path v-bind="bindFirstArea()" class="areaPart" vector-effect="non-scaling-stroke" />
				</g>
			</svg>
			<g v-if="interactive">
				<line v-bind="bindVerticalLine()" class="selector" vector-effect="non-scaling-stroke" />
				<circle v-bind="bindMarkerSecond()" class="selector_point" />
				<circle v-if="this.$store.state.graphsCryptoCompare[this.symbol] == undefined"  v-bind="bindMarkerFirst()" class="selector_point" />
			</g>
		</svg>

		<svg v-if="(interactive || mainCoin) && points && points.length > 0" v-bind="bindLegend()">
			<circle v-bind="bindFirstLegendMarker()" vector-effect="non-scaling-stroke"/>
			<text v-bind="bindFirstLegendLabel()" class="tooltip_label">
				Доля
			</text>
			<circle v-bind="bindSecondLegendMarker()" vector-effect="non-scaling-stroke"  />
			<text v-bind="bindSecondLegendLabel()" class="tooltip_label">
				Цена
			</text>
		</svg>

		<svg v-if="showTooltip" :id="symbol + '_tooltip'" viewBox="0 0 200 100" v-bind="tooltip()">
			<g>
				<rect width="203" y="-3" x=0 height="57" fill="#D9D9D9" />
				<rect x="2" y="20" width="98" height="32" fill="#fff" />
				<rect x="101" y="20" width="97" height="32" fill="#fff" />

				<text class="tooltip_date" x="12" y="14" fill="#000">
					{{ formatDateTime( verticalLinePosition.date ) }}
				</text>
				<text class="tooltip_label" x="12" y="32" fill="#000">
					Доля
				</text>
				<text class="tooltip_value" x="12" y="48" fill="#000">
					{{ formatPercent( verticalLinePosition.part )  }}%
				</text>
				<text class="tooltip_label" x="113" y="32" fill="#000">
					Цена
				</text>
				<text class="tooltip_value" x="113" y="48" fill="#000">
					${{ formatPrice( verticalLinePosition.price ) }}
				</text>
			</g>
		</svg>
	</svg>

</template>

<script>
	import * as d3 from 'd3'
  	import { coinsMixin } from '~/components/mixins/coins.js'

	let bisectDate = d3.bisector(function(d) { return d.date; }).right

	const tooltipWidth = 201
	const tooltipHeight = 104

	const HEIGHT_COEF = 1.6

	export default {

		mixins: [ coinsMixin ],

		props: {
			symbol: {
				type: String,
				default: 'BTC'
			},
			interactive: {
				type: Boolean,
				default: false
			},
			mainCoin: {
				type: Boolean,
				default: false
			},
			first: {
				type: Object,
				default: () => ({color: '#fff', gradient: 'GradientPart', opacity: 0.3, })
			},
			second: {
				type: Object,
				default: () => ({color: '#000', gradient: 'GradientPrice', opacity: 0.2, })
			},
			primaryColor: {
				type: String,
				default: '#ccc'
			},
			scaledRelative: {
				type: Boolean,
				default: false
			},
			dataPoints: {
				type: Array,
				default: () => [],
			}
		},

		data() {
			return {
				points: [],
				linePrice: '',
				areaPrice: '',
				linePart: '',
				areaPart: '',
				verticalLinePosition: {},
				markerSecondPosition: {},
				markerFirstPosition: {},
				graphWidth: 300,
				graphHeight: 300,
				lastPoint: {x: 0, y: 0},
				posPoint: {x: 0, y: 0},
				showTooltip: false,
			}
		},

		mounted() {
			this.isDevice = document.getElementById('ff_content').offsetWidth < 769

			if ( this.$refs.graphWrap ) {
				let offset = this.$refs.graphWrap.getBoundingClientRect()
				this.graphWidth = offset.width
				this.graphHeight = offset.height
			}

			if( this.getGraph() ) {
				this.init()
			}

			window.addEventListener('resize', this.handleResize)
			this.handleResize()
		},

		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		},

		computed: {
			viewBox() {
				return `0 ${ -this.graphHeight * 0 } ${ this.graphWidth } ${ this.graphHeight * 1 }`
			},
			graphRange() {
				let firstMax = Math.max( ...this.points.map(el => el.part ) )
				let firstMin = Math.min( ...this.points.map(el => el.part ) )
				let secondMax = Math.max( ...this.points.map(el => el.price ) )
				let secondMin = Math.min( ...this.points.map(el => el.price ) )
				let max = Math.max( firstMax, secondMax )
				let min = Math.min( firstMin, secondMin )
				let firstStart 		= -firstMax / (max - min)
				let secondStart 	= -secondMax / (max - min)
				let firstEnd 		= -firstMin / (max - min)
				let secondEnd 		= -secondMin / (max - min)
				let firstOffsetY 	= firstStart - Math.min( firstStart, secondStart )
				let secondOffsetY 	= secondStart - Math.min( firstStart, secondStart )

				return { firstStart, firstEnd, firstOffsetY, secondStart, secondEnd, secondOffsetY }
			},
			translateFirst() {
				let firstScale = this.scaledRelative ? this.graphHeight * ( this.graphRange.firstOffsetY ? this.graphRange.firstOffsetY : 0 ) : 0
				return `translate(0, ${ firstScale })`
			},				
			translateSecond() {
				let secondScale = this.scaledRelative ? this.graphHeight * ( this.graphRange.secondOffsetY ? this.graphRange.secondOffsetY : 0 ) : 0
				return `translate(0, ${ secondScale })`
			},

		},

		methods: {

			handleResize() {
			},

			init() {
				this.initPoints()
				this.initLines()

				let date = d3.scaleTime().range([0, this.graphWidth])
				let price = d3.scaleLinear().range([this.graphHeight, 0])
				let part = d3.scaleLinear().range([this.graphHeight, 0])

				let dateAxis = d3.axisBottom(date).tickFormat(d => this.formatDateTime(d)).ticks(3)
				let priceAxis = d3.axisRight(price).tickFormat(d => "$" + this.formatPrice(d, 0)).ticks(5)
				let partAxis = d3.axisRight(part).tickFormat(d => this.formatPercent(d)+"%").ticks(5)

				date.domain(d3.extent(this.points, el => el.date))
				price.domain(d3.extent(this.points, el => el.price))
				part.domain(d3.extent(this.points, el => el.part))

				let svg = d3.select(".graph")

				svg.selectAll(".axis").remove()

				if( !this.isDevice ) {
					// append bottom axis
					let bottomAxisSvg = svg.append("svg")

					bottomAxisSvg
							.attr("viewBox", `0 0 ${this.graphWidth} 20`)
							.attr("vector-effect", "non-scaling-stroke")
							.attr("class", "axis")
							.attr("preserveAspectRatio", "xMidYMax meet")
							.call(dateAxis)

					bottomAxisSvg.selectAll("line").attr("stroke", "none")
					bottomAxisSvg.selectAll("path").attr("stroke", "none")
					bottomAxisSvg.selectAll(".tick text").attr("x", 4).attr("fill", "#fff")
				}

				// append left axis
				let leftAxisSvg = svg.append("svg")

				leftAxisSvg
						.attr("viewBox", `0 0 20 ${this.graphHeight}`)
				      	.attr("vector-effect", "non-scaling-stroke")
				      	.attr("class", "axis")
				      	.attr("preserveAspectRatio", "xMinYMin meet")
				      	.call(partAxis)

				leftAxisSvg.selectAll("line").attr("stroke", "none")
				leftAxisSvg.selectAll("path").attr("stroke", "none")
				leftAxisSvg.selectAll(".tick text").attr("fill", "#fff").attr("y", "10").attr("transform", "rotate(-90)")


				// append right axis
				let rightAxisSvg = svg.append("svg")

				rightAxisSvg
					.attr("viewBox", `0 0 20 ${this.graphHeight}`)
					.attr("vector-effect", "non-scaling-stroke")
					.attr("class", "axis")
					.attr("preserveAspectRatio", "xMaxYMin meet")
					.call(priceAxis)

				rightAxisSvg.selectAll("line").attr("stroke", "none")
				rightAxisSvg.selectAll("path").attr("stroke", "none")
				rightAxisSvg.selectAll(".tick text").attr("y", "10").attr("fill", "#fff").attr("transform", "rotate(-90)")
			},
			getScales() {

				let date = d3.scaleTime().range([0, this.graphWidth])

				let firstScale = this.scaledRelative ? this.graphRange.firstEnd - this.graphRange.firstStart : 1
				let secondScale = this.scaledRelative ? this.graphRange.secondEnd - this.graphRange.secondStart : 1

				let first = d3.scaleLinear().range([ this.graphHeight * firstScale, 0 ])
				let second = d3.scaleLinear().range([ this.graphHeight * secondScale, 0 ])

				let dateAxis = d3.axisBottom(date).tickFormat( d => d.date )
				let firstAxis = d3.axisRight(first)
				let secondAxis = d3.axisLeft(second)

				date.domain(d3.extent(this.points, el => el.date))
				first.domain(d3.extent(this.points, el => el.part))
				second.domain(d3.extent(this.points, el => el.price))

				return { date, first, second }
			},
			initPoints() {
				let lineData = this.getGraph()
				this.points = []
				if( lineData ) {
					this.points = lineData.map( el => { 
						return { 
							date: 	new Date(el.created_at), 
							price: 	el.price_usdt, 
							part: 	el.part }  
						})
				}
			},
			initLines() {
				let scales = this.getScales()

				// Доли не рисуем, если данные с криптокомпаер
      			if( this.$store.state.graphs[this.symbol] != undefined) {
					const pathFirst = d3.line()
											.curve(d3.curveStepBefore)
											.x(d => scales.date(d.date))
											.y(d => scales.first(d.part))

					const areaFirst = d3.area()
											.curve(d3.curveStepBefore)
											.x(d => scales.date(d.date))
											.y0(d => this.graphHeight * HEIGHT_COEF )
											.y1(d => scales.first(d.part))

					this.linePart = pathFirst(this.points)
					this.areaPart = areaFirst(this.points)
				}


				const pathSecond = d3.line()
										.curve(d3.curveBasis)
										.x(d => scales.date(d.date))
										.y(d => scales.second(d.price))
				const areaSecond = d3.area()
										.curve(d3.curveBasis)
										.x(d => scales.date(d.date))
										.y0(d => this.graphHeight * HEIGHT_COEF )
										.y1(d => scales.second(d.price))

				this.linePrice = pathSecond( this.points )
				this.areaPrice = areaSecond( this.points )

				if(this.mainCoin) {
					let xRight = scales.date(this.points[ this.points.length-1 ].date)
					let yAverage 
						= (scales.first(this.points[ this.points.length-1 ].part) + scales.second(this.points[ this.points.length-1 ].price)) / 2

					this.posPoint = { 
						x: xRight, 
						y: yAverage,
						date: this.points[ this.points.length-1 ].date,
						firstValue: this.points[ this.points.length-1 ].part,
						secondValue: this.points[ this.points.length-1 ].price,
					}
				}
			},
			mouseover({ offsetX, offsetY }) {

				const scales = this.getScales()
				const svg = this.$refs.graphWrap

				if( svg == undefined ) {
					return
				}

				let pt = svg.createSVGPoint()
				pt.x = offsetX
				pt.y = offsetY
				const svgPoint = pt.matrixTransform(svg.getCTM().inverse())

				let markerSecondPosition = this.findYatX(svgPoint.x, this.$refs.linePrice) // svg reper
				let markerFirstPosition = this.findYatX(svgPoint.x, this.$refs.linePart) // svg reper

				this.markerSecondPosition = this.convertCoords(
						markerSecondPosition.x, 
						markerSecondPosition.y, 
						this.$refs.linePrice.getScreenCTM()
					)
				this.markerFirstPosition = this.convertCoords(
						markerFirstPosition.x, 
						markerFirstPosition.y, 
						this.$refs.linePart.getScreenCTM()
					)

				if (this.points && this.points.length > 0) {

					let index = bisectDate(this.points, scales.date.invert(svgPoint.x))

					let closestPoint = this.points[index-1]

					if(closestPoint == undefined) {
						return
					}

					this.verticalLinePosition = { 
						x: svgPoint.x, 
						y: svgPoint.y, 
						date: closestPoint.date, 
						price: closestPoint.price,
						part: closestPoint.part,
						offsetX: this.markerSecondPosition.x,
						offsetY: (this.markerFirstPosition.y + this.markerSecondPosition.y) / 2,
					}
					this.showTooltip = true
					this.$emit('testtest', this.verticalLinePosition )
				}
			},
			mouseleave() {
				this.showTooltip = false
				this.$emit( 'hide-tooltip' )
			},

			tooltipPosition() {
				let height = this.$refs.graphWrap.getBoundingClientRect().height
				let offsetY = height - this.verticalLinePosition.offsetY - tooltipHeight + 40
				return {
					x: this.verticalLinePosition.offsetX - tooltipWidth > 0 ?  - tooltipWidth - 20 : 20,
					y: offsetY > 0 ?  -60 : -60 + offsetY,
				}
			},

			tooltip() {

				if( !this.$refs.graph ) {
					return {
						'width': tooltipWidth,
						'height': tooltipHeight,
						'fill': '#f2f2f2',
					}
				}
				let pt = this.$refs.graph.createSVGPoint()
				pt.x = this.posPoint.x
				pt.y = this.posPoint.y
				const svgPoint = pt.matrixTransform(this.$refs.graph.getCTM())

				let yAverage = svgPoint.y + tooltipHeight > this.graphHeight ? svgPoint.y - tooltipHeight : svgPoint.y

				return { 
					'x': this.verticalLinePosition.offsetX ? this.verticalLinePosition.offsetX + this.tooltipPosition().x : 0,
					'y': 80,
					'width': tooltipWidth,
					'height': tooltipHeight,
					'fill': '#f2f2f2',
				}

			},

			bindFirstLine() {
				return {
					'transform': this.translateFirst,
					'stroke': this.first.color,
					'd': this.linePart,
				}
			},
			bindFirstArea() {
				return {
					'transform': this.translateFirst,
					'stroke': this.first.color,
					'd': this.areaPart,
					'fill': `url(#${this.first.gradient})`
				}
			},
			bindSecondLine() {
				return {
					'transform': this.translateSecond,
					'stroke': this.second.color,
					'd': this.linePrice,
				}
			},
			bindSecondArea() {
				return {
					'transform': this.translateSecond,
					'stroke': this.second.color,
					'd': this.areaPrice,
					'fill': `url(#${this.second.gradient})`

				}
			},
			bindVerticalLine() {
				return {
					'x1': this.verticalLinePosition.x,
					'x2': this.verticalLinePosition.x,
					'y1': 0,
					'y2': this.graphHeight,
					'stroke': this.primaryColor,
				}
			},
			bindLegend() {
				return {
					'x': 24,
					'y': this.isDevice ? -12 : -24,
					'width': this.graphWidth,
					'height': '100%',
					'viewBox': `0 0 ${this.graphWidth} 12`,
					'preserveAspectRatio': "xMinYMax meet",
				}
			},
			bindMarkerFirst() {
				return {
					'cx': this.markerFirstPosition.x,
					'cy': this.markerFirstPosition.y,
					'r': 3,
					'stroke': 'none',
					'fill': this.first.color,
					'fill-opacity': 1,
				}
			},
			bindMarkerSecond() {
				return {
					'cx': this.markerSecondPosition.x,
					'cy': this.markerSecondPosition.y,
					'r': 3,
					'stroke': 'none',
					'fill': this.second.color,
					'fill-opacity': 0.5,
				}
			},
			bindFirstLegendMarker() {
				return {
					'fill': this.first.color,
					'r': 6,
					'cx': 10,
					'cy': 6,
				}
			},
			bindFirstLegendLabel() {
				return {
					'fill': '#000',
					'x': 24,
					'y': 11,
					'font-size': 12,
				}
			},
			bindSecondLegendMarker() {
				return {
					'fill': this.second.color,

					'r': 6,
					'cx': 200,
					'cy': 6,
					'fill-opacity': '0.5'

				}
			},
			bindSecondLegendLabel() {
				return {
					'fill': '#000',
					'x': 214,
					'y': 11,
					'font-size': 12,
				}
			},

			findYatX( x, linePath ) {
				let beginning = 0,
					pos,
					end = linePath.getTotalLength(),
					target = null

				while (true) {
					target = Math.floor((beginning + end) / 2)
					pos = linePath.getPointAtLength(target)

					if ((target === end || target === beginning) && Math.floor(pos.x) !== Math.floor(x)) {
						return pos
					}
					if (Math.floor(pos.x) > Math.floor(x))  {
						end = target
					} else if (Math.floor(pos.x) < Math.floor(x)) { 
						beginning = target
					} else  { //position found
						return pos
					} 
				}
			},
			convertCoords( x, y, matrix ) {
				let offset = this.$refs.graph.getBoundingClientRect()
				return {
					x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
					y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
				}
			},
			getGraph() {
				console.log(this.dataPoints)
				if( this.dataPoints.length > 0 ) {
					return this.dataPoints
				}
				if( this.$store.state.graphs[this.symbol] != undefined ) {
					return this.$store.state.graphs[ this.symbol ]
				}
				if( this.$store.state.graphsCryptoCompare[this.symbol] != undefined) {
					return this.$store.state.graphsCryptoCompare[ this.symbol ]
				}


			},
		},

		watch: {
			'$store.state.graphs': {
				handler: function ( newValue ) {
					this.init()
				},
				deep: true,
			},
			'$store.state.graphsCryptoCompare': {
				handler: function ( newValue ) {
					if( this.$store.state.graphs[this.symbol] == undefined) {
						this.init()
					}
				},
				deep: true,
			},

		},
	}

</script>


<style lang="sass" scoped>

	.linePrice 
		fill: none
		opacity: 0.2
		stroke-width: 1px

	.linePart
		fill: none
		stroke-width: 1px

	.areaPrice
		opacity: 0.2

	.areaPart
		opacity: 0.1

	.selector
		opacity: 1
		stroke-width: 1px

	.tick 
		opacity: 0
		font-size: 36px
		text
			font-size: 36px
	
</style>

