'use client';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Link from 'next/link';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

interface Item {
  label: string;
  route: string;
}

export default function NavbarBreadcrumbs({ items }: { items: Item[] }) {
  const [mounted, setMounted] = useState(false);

  // Ensure it only renders after mounting to avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents mismatch during hydration

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
       {items.map((item, index) => (
        <Link key={index} href={item.route} passHref>
          <Typography
            variant="body1"
            sx={{
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            {item.label}
          </Typography>
        </Link>
      ))}
    </StyledBreadcrumbs>
  );
}
