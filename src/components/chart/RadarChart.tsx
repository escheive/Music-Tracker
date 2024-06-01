import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RadarChart = ({
  data, // Array of objects with keys representing categories and values representing data points
  width = 640,
  height = 640,
  centerX = width / 2, // X-coordinate of the center point
  centerY = height / 2, // Y-coordinate of the center point
  radius = Math.min(width, height) / 2 - 60, // Radius of the chart
  maxRadius = 320,
  categories, // Array of category names (e.g. for mood, ['Happiness', 'Sadness', 'Excitement'])
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

    const line = d3.lineRadial()
      .angle((d, i) => angleScale(i))
      .radius(d => Math.min(radius, maxRadius * d))
  
    const concatenatedPath = line(data) + 'Z';
    // const concatenatedPath = line(averagedData) + 'Z';

    // Draw radar lines
    svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('fill', 'pink') // Fill color
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

    // Add reference dot at the center
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 1) // Radius of the dot
      .attr('fill', 'black'); // Color of the dot

    // Add cross lines to each point and through the middle
    const crossLines = svg.selectAll('.cross-line')
      .data(categories)
      .enter()
      .append('line')
      .attr('class', 'cross-line')
      .attr('x1', centerX) // Start at the center horizontally
      .attr('y1', centerY) // Start at the center vertically
      .attr('x2', (d, i) => {
        const angle = angleScale(i - 1);
        return centerX + radius * Math.cos(angle);
      })
      .attr('y2', (d, i) => {
        const angle = angleScale(i - 1);
        return centerY + radius * Math.sin(angle);
      })
      .attr('stroke', 'gray')
      .attr('stroke-width', 1);

    // Calculate the coordinates for the line halfway to the border
      const halfwayLineCoords = categories.map((d, i) => {
        const angle = angleScale(i - 1);
        const x = centerX + (radius / 2) * Math.cos(angle);
        const y = centerY + (radius / 2) * Math.sin(angle);
        return `${x},${y}`;
      });

      // Calculate and set the path for the border
    const halfwayPath = svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('stroke-width', 1);

      halfwayPath.attr('d', `M${halfwayLineCoords.join('L')}Z`);
  };


  return (
    <>
      <svg ref={svgRef} width={width} height={height}></svg>
    </>
  );
};

export default RadarChart;