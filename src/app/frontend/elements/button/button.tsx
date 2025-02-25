import { Button as MuiButton, ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, sx, ...props }) => {
  return (
    <MuiButton sx={{ ...sx }} {...props}>
      {children}
    </MuiButton>
  );
};

export default CustomButton;
