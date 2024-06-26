import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Flex, Heading, Stack, Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

interface LineChartProps {
  title: string;
  description: string;
  data: any[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  description,
  data,
  width = 720,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 40,
  marginLeft = 40 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isObjectData = typeof data[0] === 'object';
  const total = !isObjectData ? (data as number[]).reduce((acc, d) => acc + d, 0) : 0;
  const average = isObjectData ? 0 : total / data.length;

  // Function to transform happy and energy score from -1 to 1 range to 0 to 100
  const transformScore = (score: number) => 50 * (score + 1);

  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // Calculate date 30 days ago

    const x = isObjectData 
      ? d3.scaleTime()
        .domain([thirtyDaysAgo, now]) // Set domain from 30 days ago to today
        .range([marginLeft, width - marginRight])
      : d3.scaleLinear()
          .domain([0, data.length])
          .range([marginLeft, width - marginRight]);

    const filteredData: number[] = data.filter((d): d is number => typeof d === 'number');
    const y = d3.scaleLinear()
      .domain([0, isObjectData ? 100 : d3.max(filteredData) || 0])  // Use filteredData for domain calculation
      .range([height - marginBottom, marginTop]);

    const xAxis = isObjectData 
      ? d3.axisBottom<any>(x).ticks(10).tickFormat(d3.timeFormat('%m/%d')).tickPadding(10)
      : d3.axisBottom(x).ticks(data.length-1);
    const yAxis = d3.axisLeft(y);

    svg.append('g')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${marginLeft}, 0)`)
      .call(yAxis);

    if (isObjectData) {
      const happyLine: any = d3.line()
        .x((d: any) => x(new Date(d.date)))
        .y((d: any) => y(transformScore(d.Happiness)));

      const energyLine: any = d3.line()
        .x((d: any) => x(new Date(d.date)))
        .y((d: any) => y(transformScore(d.Energetic)));

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
        .data(data as number[])
        .enter()
        .append('circle')
        .attr('class', 'happy')
        .attr('cx', (d: any) => x(new Date(d.date)))
        .attr('cy', (d: any) => y(transformScore(d.Happiness)))
        .attr('r', 2.5)
        .attr('fill', 'white')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5);

      // Circles for each data point on energy line
      svg.selectAll('circle.energy')
        .data(data as number[])
        .enter()
        .append('circle')
        .attr('class', 'energy')
        .attr('cx', (d: any) => x(new Date(d.date)))
        .attr('cy', (d: any) => y(transformScore(d.Energetic)))
        .attr('r', 2.5)
        .attr('fill', 'white')
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5);
    } else {
      const line = d3.line()
        .x((_d, i) => x(i+1))
        .y((d: any) => y(d));

      // Path for single line
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      // Circles for each data point
      svg.selectAll('circle')
        .data(data as number[])
        .enter()
        .append('circle')
        .attr('cx', (_d, i) => x(i+1))
        .attr('cy', (d: any) => y(d))
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

  useEffect(() => {
    drawChart();
  }, [data, drawChart]); // Re-draw chart when data changes

  return (
    <Stack display='flex' width='100%' paddingInline='15%'>
      <Flex flexDirection='row' justifyContent='center' alignItems='center'>
        <Heading>{title ? title : null}</Heading>
        <Tooltip hasArrow label={description} fontSize='md'>
          <InfoOutlineIcon boxSize={6} />
        </Tooltip>
      </Flex>
      <Heading textAlign='center'>{average ? average.toFixed(2) : null}</Heading>
      <svg ref={svgRef} viewBox='0, 0, 720, 400'></svg>
    </Stack>
  );
};

export default LineChart;