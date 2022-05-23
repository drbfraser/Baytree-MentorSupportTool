import { Container, Divider, Grow, Typography } from "@mui/material";
import { FunctionComponent } from "react";

const FormContainer: FunctionComponent<{ title: string }> = ({ title, children }) => {
  return <Grow in>
    <Container maxWidth="md" sx={{ boxShadow: 5, borderRadius: 5, p: 2 }}>
      {/* Title */}
      <Typography
        component="h2"
        variant="h6"
        color="text.secondary"
        gutterBottom
      >
        {title}
      </Typography>
      <Divider />
      {children}
    </Container>
  </Grow>
}

export default FormContainer;