import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => {
    return (
        <Tabs
            {...props}
            slotProps={{
                indicator: {
                    children: <span className="MuiTabs-indicatorSpan" />,
                    style: { backgroundColor: 'transparent' },
                },
            }}
        />
    );
})(({ theme }) => {
    const isDarkMode = theme.palette.mode === 'dark';
    const selectedColor = isDarkMode ? 'hsl(213, 100%, 64%)' : 'hsl(213, 100%, 24%)';

    return {
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 40,
            width: '100%',
            backgroundColor: selectedColor, 
            borderRadius: 2,
        },
    };
});


const StyledTab = styled(Tab)(({ theme }) => {
  const isDarkMode = theme.palette.mode === 'dark';

  return {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: isDarkMode ? 'hsl(213, 100%, 24%)' : 'hsl(213, 100%, 64%)', // Unselected tab color
    '&.Mui-selected': {
      color: isDarkMode ? 'hsl(213, 100%, 64%)' : 'hsl(213, 100%, 24%)', // Selected tab color
      '& .MuiTabs-indicatorSpan': {
        backgroundColor: isDarkMode ? 'hsl(213, 100%, 64%)' : 'hsl(213, 100%, 24%)', // Matches selected tab
      },
    },
  };
});

export default function WorkspaceTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box>
        <StyledTabs value={value} onChange={handleChange}>
          <StyledTab label="Repositories" />
          <StyledTab label="Users" />
        </StyledTabs>
        <Box sx={{ p: 3 }} />
      </Box>
    </Box>
  );
}
