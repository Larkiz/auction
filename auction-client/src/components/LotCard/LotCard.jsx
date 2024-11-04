import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { lotModalOpen } from "../../redux/clientStore";

export const LotCard = ({ data }) => {
  const dispatch = useDispatch();
  function lotOpen(id) {
    dispatch(lotModalOpen(id));
  }

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
