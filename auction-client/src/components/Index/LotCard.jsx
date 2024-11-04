import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

export const LotCard = ({ data, lotOpen }) => {
  return (
    <Card sx={{ width: 300, height: "100%" }}>
      <CardContent>
        <Box flexGrow={1}>
          <Typography variant="h5" component="div">
            {data.name}
          </Typography>

          <Typography variant="body2">{data.timeStamp}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={() => lotOpen(data.id)}>
          Посмотреть
        </Button>
      </CardActions>
    </Card>
  );
};
