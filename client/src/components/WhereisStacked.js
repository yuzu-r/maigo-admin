import React, { Component } from 'react'
import * as d3 from 'd3'
import * as d3Legend from 'd3-svg-legend'
import Moment from 'moment';
import 'moment-timezone';
import '../styles/whereis.css'

class WhereisStacked extends Component {
	constructor(props) {
		super(props)
		this.state = {
      svgHeight: 500,
      svgWidth: 1000,
      tierKey: ['success', 'fail'],
			data: [
				{"user_id":"149756383275778050","params":"herschel","is_success":false,"insert_date":"2018-07-02T23:16:51.949Z"},
				{"user_id":"149756383275778050","params":"frog","is_success":true,"insert_date":"2018-07-03T00:46:47.682Z"},
				{"user_id":"329889338420625408","params":"bart","is_success":true,"insert_date":"2018-07-03T01:32:09.471Z"},
				{"user_id":"297966282010132491","params":"St Jerome","is_success":true,"insert_date":"2018-07-03T22:30:51.871Z"},
				{"user_id":"320041953955938314","params":"defiled lion","is_success":true,"insert_date":"2018-07-03T22:50:05.875Z"},
				{"user_id":"188156931322544128","params":"first city","is_success":true,"insert_date":"2018-07-04T01:18:50.933Z"},
				{"user_id":"329889338420625408","params":"st.john","is_success":false,"insert_date":"2018-07-04T15:00:13.057Z"},
				{"user_id":"329889338420625408","params":"st. john","is_success":true,"insert_date":"2018-07-04T15:01:00.899Z"},
				{"user_id":"342468337999151116","params":"sand pit","is_success":true,"insert_date":"2018-07-04T16:45:31.836Z"},
				{"user_id":"405221218069905420","params":"community center","is_success":true,"insert_date":"2018-07-04T17:25:24.652Z"},
				{"user_id":"405221218069905420","params":"city hall","is_success":false,"insert_date":"2018-07-04T17:42:23.445Z"},
				{"user_id":"338367335125483530","params":"hillside","is_success":false,"insert_date":"2018-07-04T19:21:56.148Z"},
				{"user_id":"338367335125483530","params":"hillside community church","is_success":true,"insert_date":"2018-07-04T19:22:24.608Z"},
				{"user_id":"320041953955938314","params":"street cars","is_success":false,"insert_date":"2018-07-04T19:34:19.400Z"},
				{"user_id":"320041953955938314","params":"street","is_success":false,"insert_date":"2018-07-04T19:34:59.432Z"},
				{"user_id":"338367335125483530","params":"streetcar","is_success":true,"insert_date":"2018-07-04T19:35:50.239Z"},
				{"user_id":"338367335125483530","params":"Korean church","is_success":true,"insert_date":"2018-07-04T23:28:33.501Z"},
				{"user_id":"340682097402314753","params":"Streetcar","is_success":true,"insert_date":"2018-07-05T00:07:23.896Z"},
				{"user_id":"405221218069905420","params":"Albany sport","is_success":true,"insert_date":"2018-07-05T23:02:44.493Z"},
				{"user_id":"149756383275778050","params":"fairmount","is_success":false,"insert_date":"2018-07-06T00:01:35.239Z"},	
				{"user_id":"149756383275778050","params":"fairmount","is_success":true,"insert_date":"2018-07-06T00:02:35.239Z"},	
			]
		}
		this.createStackedBarChart = this.createStackedBarChart.bind(this)
		this.mapDataForStack = this.mapDataForStack.bind(this)
	}
	componentDidMount() {
		this.createStackedBarChart()
	}
	createStackedBarChart() {
		const node = this.node;
		const margin = {top: 50, right: 300, bottom: 130, left: 60},
		  width = this.state.svgWidth - margin.left - margin.right,
		  height = this.state.svgHeight - margin.top - margin.bottom;

		const x = d3.scaleBand().rangeRound([0, width-20]).paddingInner(0.05);
		const y = d3.scaleLinear().range([height, 0 ]);

		const colorScale = d3.scaleOrdinal()
		  .range([ '#33A02C' , '#DA2C38'])
		  .domain(this.state.tierKey);

		const stack = d3.stack()
		  .keys(this.state.tierKey)
		  .order(d3.stackOrderNone)
		  .offset(d3.stackOffsetNone);  

	  let mappedData = this.mapDataForStack(this.props.data);
	  const series = stack(mappedData);
	  x.domain(mappedData.map(r => r.date));
	  const maxTotal = d3.max(mappedData, d => d.total);
	  y.domain([0, maxTotal]); 

 	 	const focus = d3.select(node)
 	 		.append('g')
		    .attr('class', 'focus')
		    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	  focus.append('g')
	      .selectAll('g')
	      .data(series)
	      .enter()
	      .append('g')
	        .attr('fill', d => colorScale(d.key))
	      .selectAll('rect')
	      .data(d => d)
	      .enter().append('rect')
	      	.attr('class', 'whereis')
	        .attr('x', d=> x(d.data.date))
	        .attr('y', d => y(d[1]))
	        .attr('height', d => y(d[0]) - y(d[1]))
	        .attr('width', x.bandwidth())
	        .on('mouseover', () => tooltip.style('display', 'block'))
	        .on('mouseout', () => tooltip.style('display', 'none'))
	        .on('mousemove', function(d) {
	          var xPosition = d3.mouse(this)[0] + 40;
	          var yPosition = d3.mouse(this)[1] + 25;
	          let tipText = Moment(d.data.date).format('M/D/YY');
	          tipText += ': ' + (d[1]-d[0]).toString() + '/' + d.data.total.toString();
          	tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')')
          	tooltip.select('text').text(tipText);  
	        });

	  const yAxis = d3.axisLeft(y)
	                  .ticks(maxTotal/2)
	                  .tickFormat(d3.format('d'));

	  let tickText = '';
	  let interval = 7;
  	const xAxis = d3.axisBottom(x)
    	              .tickFormat((d,i) => {
      	              tickText = i%interval === 0 ? Moment(d).format('M/D') : '';  
        	            return tickText;
          	        })

	  focus.append('g')
	      .attr('class', 'axis')
	      .call(yAxis);

	  focus.append('g')
	      .attr('class', 'axis')
	      .attr('transform', 'translate(0,' + height + ')')
	      .call(xAxis);

	  focus.append('text')
	    .attr('x', width/2)
	    .attr('y', height + margin.bottom/3)
	    .style('text-anchor', 'middle')
	    .text('Day');

	  focus.append('text')
	      .attr('transform', 'rotate(-90)')
	      .attr('x', 0 - (height/2))
	      .attr('y', 0 - margin.left/2)
	      .style('text-anchor','middle')
	      .text('Number of Gym Lookups')

	  focus.append('text')
	    .attr('x', width/2)             
	    .attr('y', -margin.top/2)
	    .attr('class', 'title-text')
	    .attr('text-anchor', 'middle')  
	    .text('Gym Lookups Since Launch');

	  focus.append('g')
	    .attr('class', 'legendOrdinal')
	    .attr('transform', 'translate(' + (width) + ',' + (height- margin.bottom) + ')');

	  const legendOrdinal = d3Legend.legendColor()
	    .shape('rect')
	    .shapePadding(2)
	    .scale(colorScale)
	    .title('Query Result')
	    .labels(this.state.tierKey)

	  focus.select('.legendOrdinal')
	    .call(legendOrdinal);

	  const tooltip = d3.select(node)
	  	.append('g')

	  tooltip.append('rect')
    	.attr('class', 'tooltip-whereis')
	    .attr('width', 100)
  	  .attr('height', 20);

	  tooltip.append('text')
	    .attr('x', '.5em')
	    .attr('dy', '1.2em')
	    .style('text-anchor', 'start')
	    .attr('font-size', '13px')
	    .text('Hover for more details.')
	    .attr('font-weight', 'bold');  

	}
	mapDataForStack(jsonData) {
		const minDay = convertDate(jsonData[0].insert_date); // string
		const maxDay = convertDate(jsonData[jsonData.length-1].insert_date);
		var dataSet = [];
		var setCounter = 0;
		var newDate, compareDate,d;

		var date = new Date(minDay + 'T00:00:00-07:00');
		const endDate = new Date(maxDay + 'T00:00:00-07:00');
		function convertDate(date){
			return Moment(date).tz('America/Los_Angeles').format('YYYY-MM-DD');
		}

		while (date <= endDate) {
			newDate = new Date(date);
			dataSet.push({date: newDate, success:0, fail: 0, total: 0});
			date.setDate(date.getDate() + 1);
		}
		//console.log('dataset: ', dataSet);
		for (let i=0; i < jsonData.length; i++) {
			//console.log('index:', i, 'setcounter:', setCounter, 'dataset length:', dataSet.length);
			d = jsonData[i];
			// compare the date of the row to the date of the current setCounter 
			compareDate = new Date(d.insert_date);
			//console.log('compare data point:', compareDate, ' with ', dataSet[setCounter].date);
			// first check that there is a bucket after the current one
			if (setCounter+1 < dataSet.length) {
				if (compareDate >= dataSet[setCounter].date && compareDate < dataSet[setCounter+1].date) {			
					dataSet[setCounter].total++;
					if (d.is_success === true) {
						dataSet[setCounter].success++;
					}
					else {
						dataSet[setCounter].fail++;	
					}
				}
				else {
					// needs to go in the next bucket, or the last bucket, if there are no more buckets
					if (setCounter + 1 <= dataSet.length) {
						setCounter++;
					}
					else {
						//console.log('last bucket',setCounter,dataSet.length);
					}
					dataSet[setCounter].total++;
					if (d.is_success === true) {
						dataSet[setCounter].success++;
					}
					else {
						dataSet[setCounter].fail++;	
					}			
				}				
			}
			else {
				//console.log('last bucket! and setcounter is:', setCounter);
				dataSet[setCounter].total++;
				if (d.is_success === true) {
					dataSet[setCounter].success++;
				}
				else {
					dataSet[setCounter].fail++;	
				}			

			}
		}
		return dataSet;
	}
	render() {
		return (
			<svg 
				ref={node => this.node = node} 
				width={this.state.svgWidth} 
				height={this.state.svgHeight}>
			</svg>
		)
	}
}

export default WhereisStacked;