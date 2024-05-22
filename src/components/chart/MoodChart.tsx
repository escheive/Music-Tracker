import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MoodChart = ({
  data, // Array of objects with keys representing categories and values representing data points
  width = 640,
  height = 640,
  centerX = width / 2, // X-coordinate of the center point
  centerY = height / 2, // Y-coordinate of the center point
  radius = Math.min(width, height) / 2 - 60, // Radius of the chart
  maxRadius = 320,
  categories, // Array of category names (e.g. for mood, ['Happiness', 'Sadness', 'Excitement'])
  maxScale = 100, // Maximum scale value for data normalization
  fillOpacity = 0.7,
}) => {
  const svgRef = useRef();

  useEffect(() => {
    drawChart();
  }, [data]); // Re-draw chart when data changes

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const colorScale = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeCategory10);

    const angleScale = d3.scaleLinear()
      .domain([0, categories.length])
      .range([0, Math.PI * 2])
      // .align(0)

    const normalizeData = (d) => {
      const normalized = categories.map(category => d[category] / maxScale);
      const maxValue = Math.max(...normalized);
      if (maxValue > 1) {
        const factor = 1 / maxValue; // Scale factor to fit within maxRadius
        return normalized.map(value => value * factor);
      }
      return normalized;
    };

    const averageData = () => {
      const numSamples = data.length;
      const averaged = {};
  
      categories.forEach(category => {
        const categorySum = data.reduce((acc, curr) => acc + curr[category], 0);
        averaged[category] = categorySum / numSamples;
      });
  
      return averaged;
    };

    const averagedData = normalizeData(averageData());

    const line = d3.lineRadial()
      .angle((d, i) => angleScale(i))
      .radius(d => Math.min(radius, maxRadius * d))
  
    const concatenatedPath = line(averagedData) + 'Z';

    // Add filled area
    svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .append('path')
      .attr('fill', 'pink') // Fill color
      .attr('fill-opacity', fillOpacity) // Fill opacity
      .attr('stroke', 'none') // No stroke
      .attr('d', concatenatedPath);

    // Draw radar lines
    svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => colorScale(i))
      .attr('stroke-width', 2)
      .attr('d', concatenatedPath);

    // Add category labels
    svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .selectAll('text')
      .data(categories)
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', (d, i) => (radius + 30) * Math.cos(angleScale(i - 1)))
      .attr('y', (d, i) => (radius + 10) * Math.sin(angleScale(i - 1)))
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    // Calculate and set the path for the border
    const borderPath = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    const pathData = categories.map((d, i) => {
      const x = centerX + radius * Math.cos(angleScale(i - 1));
      const y = centerY + radius * Math.sin(angleScale(i - 1));
      return `${x},${y}`;
    });

    borderPath.attr('d', `M${pathData.join('L')}Z`);
  };

  return (
    <>
      <svg ref={svgRef} width={width} height={height}></svg>
    </>
  );
};

export default MoodChart;


// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const MoodChart = ({
//   data, // Array of objects with keys representing categories and values representing data points
//   width = 640,
//   height = 640,
//   centerX = width / 2, // X-coordinate of the center point
//   centerY = height / 2, // Y-coordinate of the center point
//   radius = Math.min(width, height) / 2 - 60, // Radius of the chart
//   maxRadius = 320,
//   categories, // Array of category names (e.g. for mood, ['Happiness', 'Sadness', 'Excitement'])
//   maxScale = 100 // Maximum scale value for data normalization
// }) => {
//   const svgRef = useRef();

//   useEffect(() => {
//     drawChart();
//   }, [data]); // Re-draw chart when data changes

//   const drawChart = () => {
//     const svg = d3.select(svgRef.current);
//     svg.selectAll('*').remove();

//     const colorScale = d3.scaleOrdinal()
//       .domain(categories)
//       .range(d3.schemeCategory10);

//     const angleScale = d3.scaleLinear()
//       .domain([0, categories.length])
//       .range([0, Math.PI * 2])
//       // .align(0)

//     const normalizeData = (d) => {
//       const normalized = categories.map(category => d[category] / maxScale);
//       const maxValue = Math.max(...normalized);
//       if (maxValue > 1) {
//         const factor = 1 / maxValue; // Scale factor to fit within maxRadius
//         return normalized.map(value => value * factor);
//       }
//       return normalized;
//     };

//     const line = d3.lineRadial()
//       .angle((d, i) => angleScale(i))
//       .radius(d => Math.min(radius, maxRadius * d))

//     svg.append('g')
//       .attr('transform', `translate(${centerX}, ${centerY})`)
//       .selectAll('path')
//       .data(data)
//       .enter()
//       .append('path')
//       .attr('fill', 'none')
//       .attr('stroke', (d, i) => colorScale(i))
//       .attr('stroke-width', 2)
//       .attr('d', d => line(normalizeData(d)) + 'Z');

//     svg.append('g')
//       .attr('transform', `translate(${centerX}, ${centerY})`)
//       .selectAll('circle')
//       .data(categories)
//       .enter()
//       .append('circle')
//       .attr('cx', (d, i) => radius * Math.cos(angleScale(i - 1)))
//       .attr('cy', (d, i) => radius * Math.sin(angleScale(i - 1)))
//       .attr('r', 5)
//       .attr('fill', 'white')
//       .attr('stroke', (d, i) => colorScale(i))
//       .attr('stroke-width', 2);

//     // Add category labels
//     svg.append('g')
//       .attr('transform', `translate(${centerX}, ${centerY})`)
//       .selectAll('text')
//       .data(categories)
//       .enter()
//       .append('text')
//       .attr('x', (d, i) => (radius + 10) * Math.cos(angleScale(i - 1)))
//       .attr('y', (d, i) => (radius + 10) * Math.sin(angleScale(i - 1)))
//       .attr('text-anchor', 'middle')
//       .attr('alignment-baseline', 'middle')
//       .text(d => d)
//       .style('font-size', '12px')
//       .style('font-weight', 'bold');

//     // Calculate and set the path for the border
//     const borderPath = svg.append('path')
//       .attr('fill', 'none')
//       .attr('stroke', 'black')
//       .attr('stroke-width', 2);

//     const pathData = categories.map((d, i) => {
//       const x = centerX + radius * Math.cos(angleScale(i - 1));
//       const y = centerY + radius * Math.sin(angleScale(i - 1));
//       return `${x},${y}`;
//     });

//     borderPath.attr('d', `M${pathData.join('L')}Z`);
//   };

//   return (
//     <>
//       <svg ref={svgRef} width={width} height={height}></svg>
//     </>
//   );
// };

// export default MoodChart;
