import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import RadarChart from '@/components/chart/RadarChart';
import LineChart from '@/components/chart/LineChart';
import { Box } from '@chakra-ui/react';

const MOOD_CATEGORIES = ['Happiness', 'Energetic', 'Sadness', 'Calm']
const MAX_SCALE=100;

const MoodCharts = ({recentlyPlayed, popularityNumbers}) => {
  const svgRef = useRef();

  const normalizeData = (d) => {
    const normalized = MOOD_CATEGORIES.map(category => d[category] / MAX_SCALE);
    const maxValue = Math.max(...normalized);
    if (maxValue > 1) {
      const factor = 1 / maxValue; // Scale factor to fit within maxRadius
      return normalized.map(value => value * factor);
    }
    return normalized;
  };

  const calculateScores = (feature) => {
    const { acousticness, energy, loudness, speechiness, tempo, valence } = feature;
    
    // Define the weight influence of each audio feature
    const energyWeight = 0.4;
    const loudnessWeight = 0.3;
    const tempoWeight = 0.2;
    const acousticnessWeight = 0.4;
    const valenceWeight = 0.2;
    const tempoBreakpoint = 100;

    // Normalize loudness to a 0-1 scale (assuming loudness ranges from -60 to 0 dB)
    const normalizedLoudness = (loudness + 60) / 60;
    
    let happyScore = 0;
    let sadScore = 0;
    let calmScore = 0;
    let energeticScore = 0;

    if (valence > 0.7) {
      happyScore = 0.5 + 0.5 * ((valence - 0.7) / 0.3); // Scale 0.7-1.0 to 0.5-1.0
    } else if (valence < 0.3) {
      sadScore = 0.5 + 0.5 * ((0.3 - valence) / 0.3); // Scale 0.0-0.3 to 0.5-1.0
    } else {
      // If valence is between 0.3 and 0.7, interpolate between happy and sad
      happyScore = (valence - 0.3) / 0.4; // Scale 0.3-0.7 to 0.0-1.0
      sadScore = (0.7 - valence) / 0.4; // Scale 0.3-0.7 to 0.0-1.0
    }

    // Incorporate energy and loudness into the scores
    happyScore += energyWeight * energy + loudnessWeight * normalizedLoudness;
    sadScore -= energyWeight * energy + loudnessWeight * normalizedLoudness;

    // Ensure scores are within the 0-1 range
    happyScore = Math.min(1, Math.max(0, happyScore));
    sadScore = Math.min(1, Math.max(0, sadScore));
    
    // Calculate calm and energetic scores
    calmScore = (acousticness * acousticnessWeight) + ((100 - tempo) / 100 * tempoWeight) + ((60 + loudness) / 120 * loudnessWeight);

    energeticScore = (energy * energyWeight) + (tempo / 100 * tempoWeight) + (normalizedLoudness * loudnessWeight) + (valence * valenceWeight);

    // Adjust energetic/calm based on tempo
    if (tempo >= tempoBreakpoint) {
      energeticScore += (tempo - tempoBreakpoint) / 200; // Adjust as needed
    } else {
      calmScore += (tempoBreakpoint - tempo) / 200; // Adjust as needed
    }

    // Ensure calmScore and energeticScore are within the 0-1 range
    calmScore = Math.min(1, Math.max(0, calmScore));
    energeticScore = Math.min(1, Math.max(0, energeticScore));
  
    return { happyScore, sadScore, calmScore, energeticScore };
  };

  const averageData = () => {
    const scores = { Happiness: 0, Sadness: 0, Calm: 0, Energetic: 0 };
  
    recentlyPlayed.forEach(feature => {
      const { happyScore, sadScore, calmScore, energeticScore } = calculateScores(feature);
      scores.Happiness += happyScore;
      scores.Sadness += sadScore;
      scores.Calm += calmScore;
      scores.Energetic += energeticScore;
    });
  
    return scores;
  };

  
  let averagedData = normalizeData(averageData());

  return (
    <Box>
      <RadarChart 
        data={averagedData} 
        categories={MOOD_CATEGORIES}
      />
      <LineChart 
        title='Mood Over Time'
        data={popularityNumbers}
        description='Mood over time'
      />
    </Box>
  );
};

export default MoodCharts;
