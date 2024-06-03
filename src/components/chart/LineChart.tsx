import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Flex, Heading, Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const LineChart = ({
  title,
  description,
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 40,
  marginLeft = 40 
}) => {
  const svgRef = useRef();

  const isObjectData = typeof data[0] === 'object';

  // Calculate total sum and average of the data
  const total = data.reduce((acc, d) => acc + (isObjectData ? d.Happiness : d), 0);
  const average = total / data.length;
  console.log(data)

  useEffect(() => {
    drawChart();
  }, [data]); // Re-draw chart when data changes

  // Function to transform happy and energy score from -1 to 1 range to 0 to 100
  const transformScore = (score) => 50 * (score + 1);

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = isObjectData 
      ? d3.scaleTime()
          .domain(d3.extent(data, d => new Date(d.date)))
          .range([marginLeft, width - marginRight])
      : d3.scaleLinear()
          .domain([0, data.length])
          .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, isObjectData ? 100 : d3.max(data, d => d)])
      .range([height - marginBottom, marginTop]);

    const xAxis = isObjectData 
      ? d3.axisBottom(x).ticks(d3.timeDay.every(1))
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
        <Tooltip hasArrow label={description} fontSize='md'>
          <InfoOutlineIcon boxSize={6} />
        </Tooltip>
      </Flex>
      <Heading>{average ? average.toFixed(2) : null}</Heading>
      <svg ref={svgRef} width={width} height={height}></svg>
    </>
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