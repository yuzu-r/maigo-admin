import React, { Component } from 'react'
import * as d3 from 'd3'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
import * as d3Legend from 'd3-svg-legend'
import '../styles/raidscatter.css'

class RaidStacked extends Component {
	constructor(props) {
		super(props)
		this.state = {
      svgHeight: 500,
      svgWidth: 1000,
      tierKey: ['1', '2', '3', '4','5']
		}
		this.createStackedBarChart = this.createStackedBarChart.bind(this)
		this.getTierColor = this.getTierColor.bind(this)
		this.starText = this.starText.bind(this)
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
		  .range(d3.range(1,6).map(i => this.getTierColor(2*i-1)))
		  .domain(this.state.tierKey);

		const stack = d3.stack()
		  .keys(this.state.tierKey)
		  .order(d3.stackOrderNone)
		  .offset(d3.stackOffsetNone);  

	  let mappedData = this.mapDataForStack(this.props.data);

	  const series = stack(mappedData);

	  const hourExtent = d3.extent(mappedData, d => d.hour);
	  x.domain(d3.range(hourExtent[0], hourExtent[1] + 1, 1));

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
	        .attr('x', d => x(d.data.hour))
	        .attr('y', d => y(d[1]))
	        .attr('height', d => y(d[0]) - y(d[1]))
	        .attr('width', x.bandwidth())
	        .on('mouseover', () => tooltip.style('display', 'block'))
	        .on('mouseout', () => tooltip.style('display', 'none'))
	        .on('mousemove', function(d) {
	          var xPosition = d3.mouse(this)[0] + 40;
	          var yPosition = d3.mouse(this)[1] + 25;
	          tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')');
	          tooltip.select('text').text(d[1]-d[0]);
	        });

	  const yAxis = d3.axisLeft(y)
	                  .ticks(maxTotal)
	                  .tickFormat(d3.format('d'))

	  focus.append('g')
	      .attr('class', 'axis')
	      .call(yAxis);

	  focus.append('g')
	      .attr('class', 'axis')
	      .attr('transform', 'translate(0,' + height + ')')
	      .call(d3.axisBottom(x));

	  focus.append('text')
	    .attr('x', width/2)
	    .attr('y', height + margin.bottom/3)
	    .style('text-anchor', 'middle')
	    .text('Hatch Hour (6 am - 6 pm)');

	  focus.append('text')
	      .attr('transform', 'rotate(-90)')
	      .attr('x', 0 - (height/2))
	      .attr('y', 0 - margin.left/2)
	      .style('text-anchor','middle')
	      .text('Number of Raids')

	  focus.append('text')
	    .attr('x', width/2)             
	    .attr('y', -margin.top/2)
	    .attr('class', 'title-text')
	    .attr('text-anchor', 'middle')  
	    .text('Number of Hatches per Hour');

	  focus.append('g')
	    .attr('class', 'legendOrdinal')
	    .attr('transform', 'translate(' + (width) + ',' + (height- margin.bottom) + ')');

	  const legendOrdinal = d3Legend.legendColor()
	    .shape('rect')
	    .shapePadding(2)
	    .scale(colorScale)
	    .title('Raid Tier Guide')
	    .labels(d3.range(1,6).map(i => this.starText(i)))

	  focus.select('.legendOrdinal')
	    .call(legendOrdinal);

	  const tooltip = d3.select(node)
	  	.append('g')

	  tooltip.append('rect')
    	.attr('class', 'tooltip')

	  tooltip.append('text')
	    .attr('x', 15)
	    .attr('dy', '1.2em')
	    .style('text-anchor', 'middle')
	    .attr('font-size', '13px')
	    .attr('font-weight', 'bold');  

	}
	starText(tier) {
    let text = '';
    for (let i = 1; i <= tier; i++) {
      text += '\u2605';
    }
    return text;		
	}
	getTierColor(index) {
    let cs = d3ScaleChromatic.schemePaired; 
    return cs[index];
	}	
	mapDataForStack(jsonData) {
	  /* aggregate the raid json data for a stacked bar chart 
	  the shape of the returned data is an array with one object per hour 
	  each object looks like:
	  {1: n1, 2: n2, 3: n3, 4: n4, 5: n5, hour: h, total: N}
	  where h is an hour from 6 to 18
	        n1 is the number of tier 1 raids in that hour h
	        n2 is the number of tier 2 raids, etc...
	        total is the total number of raids in that hour h
	  */
	  const minHour = 6;
	  const maxHour = 18;
	  const raidHash = {};
	  const mappedData = [];

	  for (let i=0; i < jsonData.length; i++) {
	    let hour = new Date(d3.utcParse(jsonData[i].start_time)).getHours().toString();
	    if (raidHash[hour]) {
	      if(raidHash[hour][jsonData[i].boss.tier-1]) {
	        raidHash[hour][jsonData[i].boss.tier-1] += 1;
	      }
	      else {
	        raidHash[hour][jsonData[i].boss.tier-1] = 1;
	      }
	    } 
	    else {
	      let raidData = Array(5).fill(0);
	      raidData[jsonData[i].boss.tier-1] = 1;
	      raidHash[hour] = raidData;
	    }
	  } // end of loop through json data

	  for (let i = minHour; i <= maxHour; i++) {
	    let mappedHour = {};
	    let mappedTotal = 0;
	    mappedHour['hour'] = i;

	    if (raidHash[i]) {
	      for (let j = 0; j < this.state.tierKey.length; j++) {
	        mappedHour[this.state.tierKey[j]] = raidHash[i][j];
	        mappedTotal += raidHash[i][j];
	      }
	    }
	    else {
	      // there were no raids in this hour
	      for (let j = 0; j < this.state.tierKey.length; j++) {
	        mappedHour[this.state.tierKey[j]] = 0;  
	      }
	    }
	    mappedHour['total'] = mappedTotal;
	    mappedData.push(mappedHour);
	  }
	  
	  return mappedData;
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

export default RaidStacked;