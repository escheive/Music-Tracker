import RadarChart from '@/components/chart/RadarChart';
import LineChart from '@/components/chart/LineChart';
import { Box } from '@chakra-ui/react';

const MOOD_CATEGORIES = ['Happiness', 'Energetic', 'Sadness', 'Calm']
const MAX_SCALE=50;

interface NormalizeProps {
  value: number;
  max: number;
  min: number;
}

interface DailyScores {
  [key: string]: {
    Happiness: number; 
    Sadness: number;
    Calm: number;
    Energetic: number;
    count: number;
  }
}

// Function to normalize values to a number between 0-1
const normalize = ({value, max, min}: NormalizeProps) => {
  if (min === max) {
    return 0;
  }
  const clampedValue = Math.max(min, Math.min(value, max));
  return (clampedValue - min) / (max - min);
}

const MoodCharts = ({ recentlyPlayedSongs }: any) => {

  const normalizeData = (d: any) => {
    const normalized = MOOD_CATEGORIES.map(category => d[category] / MAX_SCALE);
    const maxValue = Math.max(...normalized);
    if (maxValue > 1) {
      const factor = 1 / maxValue; // Scale factor to fit within maxRadius
      return normalized.map(value => value * factor);
    }
    return normalized;
  };

  const calculateScores = (feature: any) => {
    const { acousticness, energy, tempo, valence } = feature;
    
    // Define the weight influence of each audio feature
    const energyHappySadWeight = 0.5;
    const valenceHappySadWeight = 0.5;

    // Weights for calm and energy
    const energyCalmWeight = 0.5
    const tempoCalmWeight = 0.4;
    const acousticnessCalmWeight = 0.1;

    const tempoCalmBreakpoint = 90;
    const tempoEnergeticBreakpoint = 120;

    // Normalize loudness to a 0-1 scale (assuming loudness ranges from -60 to 0 dB)
    const normalizedTempo = normalize({value: tempo, max: 1, min: 0});
    
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
  
    return { happyScore, sadScore, calmScore, energeticScore };
  };

  const averageData = () => {
    const scores = { Happiness: 0, Sadness: 0, Calm: 0, Energetic: 0 };
    const dailyScores: DailyScores = {};
  
    recentlyPlayedSongs.forEach((feature: any) => {
      if (!feature.tempo) {
        
      } else {
        const { happyScore, sadScore, calmScore, energeticScore } = calculateScores(feature);
        scores.Happiness += happyScore;
        scores.Sadness += sadScore;
        scores.Calm += calmScore;
        scores.Energetic += energeticScore;

        // Extract the date part from played_at
        const date = feature.played_at.split('T')[0];

        // Initialize the daily score object if it doesn't exist
        if (!dailyScores[date]) {
          dailyScores[date] = { Happiness: 0, Sadness: 0, Calm: 0, Energetic: 0, count: 0 };
        }

        // Add to daily scores
        dailyScores[date].Happiness += (happyScore - sadScore);
        dailyScores[date].Energetic += (energeticScore - calmScore);
        dailyScores[date].count += 1;
      }
    });

    // Convert daily scores object to an array
    const dailyScoresArray = Object.entries(dailyScores).map(([date, scores]) => {
      return {
        date,
        Happiness: scores.Happiness / scores.count,
        Energetic: scores.Energetic / scores.count,
      };
    });

    return { totalMoodScores: scores, dailyMoodScores: dailyScoresArray };
  
    // return scores;
  };
325024
  const { totalMoodScores, dailyMoodScores } = averageData();
  const normalizedTotalMoodScores = normalizeData(totalMoodScores);
  // const averagedData = normalizeData(averageData());

  return (
    <Box width='100%' padding='5%'>
      <RadarChart 
        data={normalizedTotalMoodScores} 
        categories={MOOD_CATEGORIES}
      />
      <LineChart 
        title='Mood Over Time'
        data={dailyMoodScores}
        description='A display of your mood over the past 10 days.'
      />
    </Box>
  );
};

export default MoodCharts;
