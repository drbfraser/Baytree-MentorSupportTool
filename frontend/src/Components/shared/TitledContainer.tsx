import { Container, Divider, Grow, Typography } from '@mui/material'

type TitledContainerProps = {
  title: string
  children: React.ReactNode
}

const TitledContainer: React.FC<TitledContainerProps> = (
  props: TitledContainerProps
) => {
  return (
    <Grow in>
      <Container maxWidth="md" sx={{ boxShadow: 5, borderRadius: 5, p: 2 }}>
        {/* Title */}
        <Typography
          component="h2"
          variant="h6"
          color="text.secondary"
          gutterBottom
        >
          {props.title}
        </Typography>
        <Divider />
        {props.children}
      </Container>
    </Grow>
  )
}

export default TitledContainer
