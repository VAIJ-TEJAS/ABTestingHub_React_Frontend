import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Typography } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';

interface PlayProps {
  initialChecked?: boolean;
  onToggle?: (checked: boolean) => void;
  showControls?: boolean;
}

const icon = (
  <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="body2">Collapsed Content</Typography>
    </Box>
  </Paper>
);

export default function SimpleCollapse({ 
  initialChecked = false, 
  onToggle,
  showControls = true 
}: PlayProps) {
  const [checked, setChecked] = useState(initialChecked);
  const [animationSpeed, setAnimationSpeed] = useState(300);
  const [toggleCount, setToggleCount] = useState(0);

  useEffect(() => {
    setChecked(true);
  }, []);

  useEffect(() => {
    if (onToggle) {
      onToggle(checked);
    }
  }, [checked, onToggle]);

  const handleChange = useCallback(() => {
    setChecked((prev) => {
      const newValue = !prev;
      setToggleCount((count) => count + 1);
      return newValue;
    });
  }, []);

  const handleReset = useCallback(() => {
    setChecked(initialChecked);
    setToggleCount(0);
  }, [initialChecked]);

  const handleSpeedChange = useCallback((speed: number) => {
    setAnimationSpeed(speed);
  }, []);

  const handleAutoToggle = useCallback(() => {
    const interval = setInterval(() => {
      setChecked((prev) => !prev);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 5000);
  }, []);

  return (
    <Box sx={{ height: 300, p: 2 }}>
      {showControls && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label="Show"
          />
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleReset}
            disabled={toggleCount === 0}
          >
            Reset
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleAutoToggle}
          >
            Auto Toggle
          </Button>
          <Typography variant="caption" sx={{ ml: 'auto' }}>
            Toggles: {toggleCount}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          '& > :not(style)': {
            display: 'flex',
            justifyContent: 'space-around',
            height: 120,
            width: 250,
          },
        }}
      >
        <div>
          <Collapse in={checked} timeout={animationSpeed}>
            {icon}
          </Collapse>
        </div>
      </Box>
      {showControls && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant={animationSpeed === 300 ? 'contained' : 'outlined'}
            onClick={() => handleSpeedChange(300)}
          >
            Normal
          </Button>
          <Button 
            size="small" 
            variant={animationSpeed === 150 ? 'contained' : 'outlined'}
            onClick={() => handleSpeedChange(150)}
          >
            Fast
          </Button>
          <Button 
            size="small" 
            variant={animationSpeed === 600 ? 'contained' : 'outlined'}
            onClick={() => handleSpeedChange(600)}
          >
            Slow
          </Button>
        </Box>
      )}
    </Box>
  );
}