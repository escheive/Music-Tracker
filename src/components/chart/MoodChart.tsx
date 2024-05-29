import React, { useEffect, useRef, useState } from 'react';
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
  const [moodScores, setMoodScores] = useState({ happiness: 0, sadness: 0, calm: 0, energetic: 0 });

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

    const calculateScores = (feature) => {
      const { acousticness, energy, loudness, speechiness, tempo, valence } = feature;
      
      let happyScore = 0; // Higher valence means happier
      let sadScore = 0; // Lower valence means sadder

      // let happyScore = valence; // Higher valence means happier
      // let sadScore = 1 - valence; // Lower valence means sadder

      if (valence > 0.7) {
        happyScore = 0.5 + 0.5 * ((valence - 0.7) / 0.3); // Scale 0.7-1.0 to 0.5-1.0
      } else if (valence < 0.3) {
        sadScore = 0.5 + 0.5 * ((0.3 - valence) / 0.3); // Scale 0.0-0.3 to 0.5-1.0
      } else {
        // If valence is between 0.3 and 0.7, interpolate between happy and sad
        happyScore = (valence - 0.3) / 0.4; // Scale 0.3-0.7 to 0.0-1.0
        sadScore = (0.7 - valence) / 0.4; // Scale 0.3-0.7 to 0.0-1.0
      }
      
      let calmScore = acousticness; // Higher acousticness means calmer
      let energeticScore = energy; // Higher energy means more energetic
    
      // Adjust energetic/calm based on tempo
      const tempoBreakpoint = 100;
      if (tempo >= tempoBreakpoint) {
        energeticScore += (tempo - tempoBreakpoint) / 200; // Adjust as needed
        energeticScore = Math.min(1, energeticScore); // Cap at 1
      } else {
        calmScore += (tempoBreakpoint - tempo) / 200; // Adjust as needed
        calmScore = Math.min(1, calmScore); // Cap at 1
      }
    
      return { happyScore, sadScore, calmScore, energeticScore };
    };
    
    const averageData = () => {
      const numSamples = data.length;
      const scores = { Happiness: 0, Sadness: 0, Calm: 0, Energetic: 0 };
    
      data.forEach(feature => {
        const { happyScore, sadScore, calmScore, energeticScore } = calculateScores(feature);
        scores.Happiness += happyScore;
        scores.Sadness += sadScore;
        scores.Calm += calmScore;
        scores.Energetic += energeticScore;
      });
    
      return scores;
    };
    
    let averagedData = normalizeData(averageData());

    // const averageData = () => {
    //   const numSamples = data.length;
    //   const averaged = {};
  
    //   categories.forEach(category => {
    //     const categorySum = data.reduce((acc, curr) => acc + curr[category], 0);
    //     averaged[category] = categorySum / numSamples;
    //   });
  
    //   return averaged;
    // };
    // let averagedData = normalizeData(averageData());

    

    const line = d3.lineRadial()
      .angle((d, i) => angleScale(i))
      .radius(d => Math.min(radius, maxRadius * d))
  
    const concatenatedPath = line(averagedData) + 'Z';
    // const concatenatedPath = line(normalizedData) + 'Z';

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

    // Add reference dot at the center
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 1) // Radius of the dot
      .attr('fill', 'black'); // Color of the dot
  };

  return (
    <>
      <svg ref={svgRef} width={width} height={height}></svg>
    </>
  );
};

export default MoodChart;