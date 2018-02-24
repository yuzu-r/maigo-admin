import React, { Component } from 'react'
import * as d3 from 'd3'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
import * as d3Legend from 'd3-svg-legend'
import '../styles/raidpie.css'

class RaidPie extends Component {
	constructor(props) {
		super(props)
		this.state = {
      svgHeight: 500,
      svgWidth: 1000,
		}
		this.createPieChart = this.createPieChart.bind(this)
		this.getTierColor = this.getTierColor.bind(this)
		this.starText = this.starText.bind(this)
		this.getLittlePieColor = this.getLittlePieColor.bind(this)
		this.mapDataForPie = this.mapDataForPie.bind(this)
	}
	componentDidMount() {
		this.createPieChart()
	}
	createPieChart() {
	  const node = this.node,
	    margin = {top: 70, right: 300, bottom: 110, left: 60},
	    width = this.state.svgWidth - margin.left - margin.right,
	    height = this.state.svgHeight - margin.top - margin.bottom,
	    radius = Math.min(width, height) / 2;

	  const color = d3.scaleOrdinal()
	    .range(d3.range(1,6).map(i => this.getTierColor(2*i-1)))

	  const littleColor = d3.scaleOrdinal()
	    .range(d3.range(1,10).map(i => this.getLittlePieColor(i)));

	  const bigOuterRadius = radius - 10,
	      bigInnerRadius = .6 * radius,
	      littleOuterRadius = bigInnerRadius - 5,
	      littleInnerRadius = 0;

	  const bigArc = d3.arc()
	      .innerRadius(bigInnerRadius)
	      .outerRadius(bigOuterRadius);

	  const selectedArc = d3.arc()
	      .innerRadius(bigInnerRadius)
	      .outerRadius(1.05 * bigOuterRadius);

	  const littleArc = d3.arc()
	      .outerRadius(littleOuterRadius)
	      .innerRadius(littleInnerRadius)

	  const pie = d3.pie()
	      .value(function(d) {return d['node']['total'];})
	      .sort(null);

	  const littlePie = d3.pie()
	      .value(function(d) {return d['total']});

	  const focus = d3.select(node).append('g')
	      .attr('class', 'focus')
	      .attr('transform', 'translate(' + (width / 2 ) + ',' + (.6* height + margin.top) + ')');

	  const subtitle = d3.select(node).append('text')
	      .attr('x', width/2)
	      .attr('y', .8 * margin.top)
	      .attr('text-anchor', 'middle')
	      .text('select a tier to see raid bosses');

	  let data = this.mapDataForPie(this.props.data);

	  const slices = focus.selectAll('.arc')
	      .data(pie(data))
	    .enter().append('g')
	      .attr('class', 'arc')

	  slices.append('path')
	      .attr('d', bigArc)
	      .style('fill', (d,i) => color(i));

	  d3.select(node).append('text')
	    .attr('x', width/2)
	    .attr('y', margin.top/2)
	    .attr('class', 'title-text')
	    .attr('text-anchor', 'middle')  
	    .text('Raid Boss Distribution by Tier')

	  d3.selectAll('.arc path').call(fillMe);

    d3.select(node).append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(' + (width) + ',' + (height- margin.bottom) + ')');

    const legendOrdinal = d3Legend.legendColor()
      .shape('rect')
      .shapePadding(2)
      .scale(color)
      .title('Raid Tier Guide')
      .labels(d3.range(1,6).map(i => this.starText(i)))

    d3.select(node).select('.legendOrdinal')
      .call(legendOrdinal);

	  function midAngle(d) { 
	    // calculates the angle for the middle of a slice
	    return d.startAngle + (d.endAngle - d.startAngle) / 2; 
	  }

	  function fillMe(selection){
	    let that;
	    selection.on('mouseenter', function(selectData,i) {
	      that = d3.select(this);
	      d3.select(this).attr('d', selectedArc);
	      slices.attr('opacity', function(e,j) {
	        if (i !== j) {
	          return .35;
	        }
	      })    
	      let index = selectData['index'];
	      subtitle.text('Tier ' + (index + 1) + ' Raid Bosses');
	      const lg = focus.selectAll('.larc')
	        .data(littlePie(data[index]['subnode']))
	        .enter().append('g')
	        .attr('class', 'larc')
	      lg.append('path')
	        .attr('d', littleArc)
	        .style('fill', (d,j) => littleColor(j));
	      lg.append('g').attr('class','bossSlices');
	      lg.append('g').attr('class','labelLines');
	      lg.append('g').attr('class','labels');
	      focus.select('.labels').selectAll('text')
	        .data(littlePie(data[index]['subnode']))
	        .enter().append('text')
	          .attr('dy', '.35em')
	          .html(d => d.data['type'] + ': ' + d.data['total'])
	          .attr('transform',function(d) {
	            let pos = bigArc.centroid(d);
	            // changes the point to be on left/right depending on label
	            pos[0] = bigOuterRadius * (midAngle(d) < Math.PI ? 1 : -1);
	            pos[0] = 1.1 * pos[0];
	            return 'translate(' + pos + ')';
	          })
	          // if slice is on the left, anchor text to start, else anchor to end    
	          .style('text-anchor', d =>
	            (midAngle(d)) < Math.PI ? 'start' : 'end');

	      focus.select('.labelLines').selectAll('polyline')
	          .data(littlePie(data[index]['subnode']))
	            .enter().append('polyline')
	              .attr('points', function(d) {
	                let pos = bigArc.centroid(d);
	                pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
	                return [littleArc.centroid(d), bigArc.centroid(d), pos]
	              });
	      })
	    selection.on('mouseout', () => {
	      that.attr('d', bigArc);
	      subtitle.text('select a tier to see raid bosses');
	      focus.selectAll('.larc').remove();
	      slices.attr('opacity', 1);
	    });
	  }


	}
	starText(tier) {
    let text = '';
    for (let i = 1; i <= tier; i++) {
      text += '\u2605';
    }
    return text;		
	}
	getTierColor(index) {
    const cs = d3ScaleChromatic.schemePaired; 
    return cs[index];
	}
  getLittlePieColor(index) {
    const colors = d3.schemeCategory20;
    return colors[index-1];
  }
	mapDataForPie(jsonData) {
	  let mappedData = [], tempNode = {}, tempSubNode ={}, index;
	  /* need data in the shape as follows:
	  // {'node': {'tier': 2, 'total': 4},
	  						'subnode': [ {'type': 'b', 'total': 1}, {'type': 'c', 'total': 3} ]
	  		},
	 	*/
	  for (let i = 0; i < jsonData.length; i++ ) {
	    index = jsonData[i]["boss"]["tier"]-1;
	    if (mappedData[index] === undefined) {
	      tempNode = {'node': {'tier': index+1, 'total': 1}, 'subnode': [{'type': jsonData[i]['boss']['name'], 'total': 1}]};
	      mappedData[index] = tempNode;
	    }
	    else {
	      let found = false;
	      for (let j = 0; j < mappedData[index]['subnode'].length; j++){
	        // check for the existence of the current raid boss in the mappedData
	        if (mappedData[index]['subnode'][j]['type'] === jsonData[i]['boss']['name']) {
	          mappedData[index]['subnode'][j]['total'] += 1;
	          mappedData[index]['node']['total'] += 1;
	          found = true;
	          break;
	        }
	      }
	      if (!found) {
	        // add new boss to the subnode
	        tempSubNode = {'type' : jsonData[i]['boss']['name'], 'total': 1};
	        mappedData[index]['subnode'].push(tempSubNode);
	        mappedData[index]['node']['total'] += 1;
	      }
	    }
	  }
	  for (let tier = 0; tier <= 4; tier++ ) {
	    if (mappedData[tier] === undefined) {
	      mappedData[tier] = {'node': {'tier': tier+1, 'total': 0}};
	    }
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


export default RaidPie;