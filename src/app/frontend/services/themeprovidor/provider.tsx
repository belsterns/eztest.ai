'use client';
import AppTheme from './theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      {children}
    </AppTheme>
  );
}
