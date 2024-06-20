import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Flex, Heading, Square, Stack, Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const LineChart = ({
  title,
  description,
  data,
  size,
  width = 720,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 40,
  marginLeft = 40 
}) => {
  const svgRef = useRef();

  const isObjectData = typeof data[0] === 'object';

  const total = data.reduce((acc, d) => acc + d, 0);
  const average = isObjectData ? 0 : total / data.length;

  useEffect(() => {
    drawChart();
  }, [data]); // Re-draw chart when data changes

  // Function to transform happy and energy score from -1 to 1 range to 0 to 100
  const transformScore = (score) => 50 * (score + 1);

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // Calculate date 30 days ago

    const x = isObjectData 
      ? d3.scaleTime()
        .domain([thirtyDaysAgo, now]) // Set domain from 30 days ago to today
        .range([marginLeft, width - marginRight])
      // ? d3.scaleTime()
      //   .domain([
      //     d3.timeDay.offset(d3.min(data, d => new Date(d.date)), -29), // Start date 30 days ago
      //     d3.timeDay.offset(d3.max(data, d => new Date(d.date)), 1) // End date is max date + 1 day
      //   ])
      //   .range([marginLeft, width - marginRight])
      : d3.scaleLinear()
          .domain([0, data.length])
          .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, isObjectData ? 100 : d3.max(data, d => d)])
      .range([height - marginBottom, marginTop]);

    const xAxis = isObjectData 
      ? d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat('%m/%d')).tickPadding(10)
      : d3.axisBottom(x).ticks(data.length-1);
    const yAxis = d3.axisLeft(y);

    svg.append('g')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${marginLeft}, 0)`)
      .call(yAxis);

    if (isObjectData) {
      const happyLine = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(transformScore(d.Happiness)));

      const energyLine = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(transformScore(d.Energetic)));

      // Path for happy line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5)
        .attr('d', happyLine);

      // Path for energy line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5)
        .attr('d', energyLine);

      // Circles for each data point on happy line
      svg.selectAll('circle.happy')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'happy')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(transformScore(d.Happiness)))
        .attr('r', 2.5)
        .attr('fill', 'white')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5);

      // Circles for each data point on energy line
      svg.selectAll('circle.energy')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'energy')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(transformScore(d.Energetic)))
        .attr('r', 2.5)
        .attr('fill', 'white')
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5);
    } else {
      const line = d3.line()
        .x((d, i) => x(i+1))
        .y(d => y(d));

      // Path for single line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      // Circles for each data point
      svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => x(i+1))
        .attr('cy', d => y(d))
        .attr('r', 2.5)
        .attr('fill', 'white')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.5);
    }

    if (!isObjectData) {
      // Draw dashed line for mean
      svg.append('line')
        .attr('x1', marginLeft)
        .attr('y1', y(average))
        .attr('x2', width - marginRight)
        .attr('y2', y(average))
        .attr('stroke', 'currentColor')
        .attr('stroke-dasharray', '5,5');
    } else {
      // Legend
      const legend = svg.append('g')
        .attr('transform', `translate(${width - marginRight - 100}, ${marginTop})`);

      legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'blue');

      legend.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text('Happiness')
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');

      legend.append('rect')
        .attr('x', 0)
        .attr('y', 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'red');

      legend.append('text')
        .attr('x', 15)
        .attr('y', 30)
        .text('Energy')
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');
    }
  };

  return (
    <Stack>
      <Flex flexDirection='row' justifyContent='center' alignItems='center'>
        <Heading>{title ? title : null}</Heading>
        <Tooltip hasArrow label={description} fontSize='md'>
          <InfoOutlineIcon boxSize={6} />
        </Tooltip>
      </Flex>
      <Heading textAlign='center'>{average ? average.toFixed(2) : null}</Heading>
      <svg ref={svgRef} width={width} height={height}></svg>
    </Stack>
  );
};

export default LineChart;



// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import { Box, Flex, Heading, Tooltip } from '@chakra-ui/react';
// import { InfoOutlineIcon } from '@chakra-ui/icons';

// const LineChart = ({
//   title,
//   description,
//   data,
//   width = 640,
//   height = 400,
//   marginTop = 20,
//   marginRight = 20,
//   marginBottom = 40,
//   marginLeft = 40 
// }) => {
//   const svgRef = useRef();
//   // Calculate total sum of the data
//   const total = data.reduce((acc, number) => acc + number, 0);

//   // Calculate average of the data
//   const average = total / data.length;

//   useEffect(() => {
//     drawChart();
//   }, [data]); // Re-draw chart when data changes

//   const drawChart = () => {
//     const svg = d3.select(svgRef.current);
//     svg.selectAll('*').remove();

//     const x = d3.scaleLinear()
//       .domain([0, data.length])
//       .range([marginLeft, width - marginRight]);

//     const y = d3.scaleLinear()
//       .domain([0, 100])
//       .range([height - marginBottom, marginTop]);

//     const xAxis = d3.axisBottom(x).ticks(data.length - 1);
//     const yAxis = d3.axisLeft(y);

//     svg.append('g')
//       .attr('transform', `translate(0, ${height - marginBottom})`)
//       .call(xAxis);

//     svg.append('g')
//       .attr('transform', `translate(${marginLeft}, 0)`)
//       .call(yAxis);

//     const line = d3.line()
//       .x((d, i) => x(i + 1))
//       .y(d => y(d));

//     // Path between each data point
//     svg.append('path')
//       .datum(data)
//       .attr('fill', 'none')
//       .attr('stroke', 'currentColor')
//       .attr('stroke-width', 1.5)
//       .attr('d', line);

//     // Circles for each tracks score
//     svg.selectAll('circle')
//       .data(data)
//       .enter()
//       .append('circle')
//       .attr('cx', (d, i) => x(i + 1))
//       .attr('cy', d => y(d))
//       .attr('r', 2.5)
//       .attr('fill', 'white')
//       .attr('stroke', 'currentColor')
//       .attr('stroke-width', 1.5);

//     // Draw dashed line for mean
//     svg.append('line')
//       .attr('x1', marginLeft)
//       .attr('y1', y(average))
//       .attr('x2', width - marginRight)
//       .attr('y2', y(average))
//       .attr('stroke', 'currentColor')
//       .attr('stroke-dasharray', '5,5');
//   };

//   return (
//     <>
//       <Flex flexDirection='row' justifyContent='center' alignItems='center'>
//         <Heading>{title ? title : null}</Heading>
//         <Tooltip hasArrow label={description} fontSize='md'>
//           <InfoOutlineIcon boxSize={6} />
//         </Tooltip>
//       </Flex>
//       <Heading>{average ? average : null}</Heading>
//       <svg ref={svgRef} width={width} height={height}></svg>
//     </>
//   );
// };

// export default LineChart;