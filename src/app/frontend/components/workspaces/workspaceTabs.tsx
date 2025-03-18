import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';

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
  const indicatorColor = isDarkMode ? 'white' : 'black';

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
      backgroundColor: indicatorColor,
      borderRadius: 2,
    },
  };
});

const StyledTab = styled(Tab)(({ theme }) => {
  const isDarkMode = theme.palette.mode === 'dark';
  const selectedColor = isDarkMode ? 'white' : 'black';
  const unselectedColor = isDarkMode ? 'grey' : 'grey';

  return {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: unselectedColor, // Unselected tab color
    '&.Mui-selected': {
      color: selectedColor, // Selected tab color
      '& .MuiTabs-indicatorSpan': {
        backgroundColor: selectedColor, // Matches selected tab
      },
    },
  };
});



export default function WorkspaceTabs() {
    const [value, setValue] = useState(0);
    const router = useRouter();

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    const tabs = [
      { label: "Repositories", route: "repositories" },
      { label: "Users", route: "users" },
    ];
  
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
          <StyledTabs value={value} onChange={handleChange}>
            {tabs.map((item, index) => (
              <StyledTab
                key={index}
                label={item.label}
                onClick={() => router.push(item.route)}
              />
            ))}
          </StyledTabs>
      </Box>
    );
}
