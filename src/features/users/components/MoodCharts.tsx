import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import RadarChart from '@/components/chart/RadarChart';
import LineChart from '@/components/chart/LineChart';
import { Box } from '@chakra-ui/react';

const MOOD_CATEGORIES = ['Happiness', 'Energetic', 'Sadness', 'Calm']
const MAX_SCALE=50;

// Function to normalize values to a number between 0-1
const normalize = (value, max, min) => {
  if (min === max) {
    return 0;
  }
  const clampedValue = Math.max(min, Math.min(value, max));
  return (clampedValue - min) / (max - min);
}

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
    const energyHappySadWeight = 0.25;
    const loudnessHappySadWeight = 0.25;
    const valenceHappySadWeight = 0.5;

    // Weights for calm and energy
    const energyCalmWeight = 0.4
    const loudnessCalmWeight = 0.3
    const tempoCalmWeight = 0.2;
    const acousticnessCalmWeight = 0.1;

    const tempoCalmBreakpoint = 90;
    const tempoEnergeticBreakpoint = 120;

    // Normalize loudness to a 0-1 scale (assuming loudness ranges from -60 to 0 dB)
    const normalizedLoudness = (loudness + 60) / 60;
    const normalizedTempo = normalize(tempo, 1, 0);
    
    let happyScore = 0;
    let sadScore = 0;
    let calmScore = 0;
    let energeticScore = 0;

    if (valence > 0.7) {
      happyScore += valence * valenceHappySadWeight; // Scale 0.7-1.0 to 0-0.5
    } else if (valence < 0.3) {
      sadScore += (1 - valence) * valenceHappySadWeight; // Scale 0.0-0.3 to 0-0.5
    } else {
      // If valence is between 0.3 and 0.7, interpolate between happy and sad
      happyScore += valence * valenceHappySadWeight; // Scale 0.3-0.7 to 0.0-0.5
      sadScore += (1 - valence) * valenceHappySadWeight; // Scale 0.3-0.7 to 0.0-0.5
    }

    // Incorporate energy and loudness into the scores
    if (energy > 0.7) {
      happyScore += energy * energyHappySadWeight; // 0.0-0.25
      energeticScore += energy * energyCalmWeight; // 0-0.4
    } else if (energy < 0.3) {
      sadScore += (1 - energy) * energyHappySadWeight; // 0.0-0.25
      calmScore += (1 - energy) * energyCalmWeight; // 0-0.4
    } else {
      happyScore += energy * energyHappySadWeight; // 0.0-0.25
      sadScore += (1 - energy) * energyHappySadWeight; // 0.0-0.25
      energeticScore += energy * energyCalmWeight; // 0-0.4
      calmScore += (1 - energy) * energyCalmWeight; // 0-0.4
    }

    // Incorporate energy and loudness into the scores
    if (normalizedLoudness > 0.7) {
      happyScore += normalizedLoudness * loudnessHappySadWeight; // 0-0.1
      energeticScore += normalizedLoudness * loudnessCalmWeight; // 0-0.3
    } else if (normalizedLoudness < 0.3) {
      sadScore += (1 - normalizedLoudness) * loudnessHappySadWeight; // 0-0.1
      calmScore += (1 - normalizedLoudness) * loudnessCalmWeight; // 0-0.3
    } else {
      happyScore += normalizedLoudness * loudnessHappySadWeight;
      sadScore += (1 - normalizedLoudness) * loudnessHappySadWeight;
      energeticScore += normalizedLoudness * loudnessCalmWeight; // 0-0.3
      calmScore += (1 - normalizedLoudness) * loudnessCalmWeight; // 0-0.3
    }

    // Ensure scores are within the 0-1 range
    happyScore = Math.min(1, Math.max(0, happyScore));
    sadScore = Math.min(1, Math.max(0, sadScore));
    
    // Calculate calm and energetic scores for tempo
    if (tempo > tempoEnergeticBreakpoint) {
      energeticScore += normalizedTempo * tempoCalmWeight; // 0-0.2
    } else if (tempo < tempoCalmBreakpoint) {
      calmScore += (1 - normalizedTempo) * tempoCalmWeight; // 0-0.2
    } else {
      // If tempo is between 90 and 120, interpolate for both scores
      energeticScore += normalizedTempo * tempoCalmWeight; // 0-0.2
      calmScore += (1 - normalizedTempo) * tempoCalmWeight; // 0-0.2
    }

    if (acousticness > 0.7) {
      calmScore += acousticness * acousticnessCalmWeight; // 0-0.1
    } else if (acousticness < 0.3) {
      energeticScore += (1 - acousticness) * acousticnessCalmWeight; // 0-0.1
    } else {
      calmScore += acousticness * acousticnessCalmWeight; // Scale 0.3-0.7 to 0.0-0.1
      energeticScore += (1 - acousticness) * acousticnessCalmWeight; // Scale 0.3-0.7 to 0.0-0.1
    }

    // Ensure calmScore and energeticScore are within the 0-1 range
    calmScore = Math.min(1, Math.max(0, calmScore));
    energeticScore = Math.min(1, Math.max(0, energeticScore));

    console.log(feature.name, 'loud', normalizedLoudness, 'valence', feature.valence, 'tempo', feature.tempo, 'energy', feature.energy, { happyScore, sadScore, calmScore, energeticScore })
  
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



  console.log(averagedData)
  console.log(popularityNumbers)

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
