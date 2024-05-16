import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Flex, Heading, Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const MoodChart = ({
  title,
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 40,
  marginLeft = 40 
}) => {
  const svgRef = useRef();
  // Calculate total sum of the data
  const total = data.reduce((acc, number) => acc + number, 0);

  // Calculate average of the data
  const average = total / data.length;

  useEffect(() => {
    drawChart();
  }, [data]); // Re-draw chart when data changes

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear()
      .domain([0, data.length])
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - marginBottom, marginTop]);

    const xAxis = d3.axisBottom(x).ticks(data.length - 1);
    const yAxis = d3.axisLeft(y);

    svg.append('g')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${marginLeft}, 0)`)
      .call(yAxis);

    const line = d3.line()
      .x((d, i) => x(i + 1))
      .y(d => y(d));

    // Path between each data point
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Circles for each tracks score
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => x(i + 1))
      .attr('cy', d => y(d))
      .attr('r', 2.5)
      .attr('fill', 'white')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.5);

    // Draw dashed line for mean
    svg.append('line')
      .attr('x1', marginLeft)
      .attr('y1', y(average))
      .attr('x2', width - marginRight)
      .attr('y2', y(average))
      .attr('stroke', 'currentColor')
      .attr('stroke-dasharray', '5,5');
  };

  return (
    <>
      <Flex flexDirection='row' justifyContent='center' alignItems='center'>
        <Heading>{title ? title : null}</Heading>
        <Tooltip hasArrow label='Popularity of your 50 most recently played tracks. Based on number of listens and how recent they were.' fontSize='md'>
          <InfoOutlineIcon boxSize={6} />
        </Tooltip>
      </Flex>
      <Heading>{average ? average : null}</Heading>
      <svg ref={svgRef} width={width} height={height}></svg>
    </>
  );
};

export default MoodChart;


// import * as d3 from 'd3';

// // Declare the chart dimensions and margins.


// const MoodChart = ({
//   data,
//   width = 640,
//   height = 400,
//   marginTop = 20,
//   marginRight = 20,
//   marginBottom = 20,
//   marginLeft = 20
// }) => {
//   const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
//   const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
//   const line = d3.line((d, i) => x(i), y);

//   return (
//     <>
//       <svg width={width} height={height}>
//         <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
//         <g fill="white" stroke="currentColor" strokeWidth="1.5">
//           {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
//         </g>
//       </svg>
//     </>
//   )
// }

// export default MoodChart;