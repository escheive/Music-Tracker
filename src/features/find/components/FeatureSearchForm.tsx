import { useState } from 'react';
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

interface FeatureSearchFormProps {
  onSearch: (searchParams: Record<string, any>) => void;
}

export const FeatureSearchForm: React.FC<FeatureSearchFormProps> = ({ onSearch }) => {
  const [valence, setValence] = useState('');
  const [tempo, setTempo] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onSearch({ valence, tempo });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4}>
        <FormLabel>Valence</FormLabel>
        <Input
          placeholder="Enter valence"
          value={valence}
          onChange={(e) => setValence(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Tempo</FormLabel>
        <Input
          placeholder="Enter tempo"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
        />
      </FormControl>
      <Button type="submit" colorScheme="teal">Search by Features</Button>
    </form>
  );
};
