import { Card as MuiCard, CardProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface CardWrapperProps extends CardProps {
  variant?: "outlined" | "elevation"; // Allow variant prop
}

const StyledCard = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const Card: React.FC<CardWrapperProps> = ({ children, variant = "outlined", ...props }) => {
  return (
    <StyledCard variant={variant} {...props}>
      {children}
    </StyledCard>
  );
};

export default Card;
