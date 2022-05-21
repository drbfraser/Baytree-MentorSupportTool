import { Skeleton, Divider } from "@mui/material";

const LoadingScreen = () => {
  return (
    <div>
      {Array(3)
        .fill(0)
        .map((_, index, array) => (
          <>
            <Skeleton
              variant="rectangular"
              width={200}
              height={30}
              sx={{ my: 3 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={80}
              sx={{ mb: 3 }}
            />
            {/* Ignore the last line */}
            {index !== array.length - 1 && <Divider />}
          </>
        ))}
    </div>
  );
};

export default LoadingScreen;