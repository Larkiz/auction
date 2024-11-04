import { Button } from "@mui/material";

export const OwnerActions = ({ active, startAuction, stopAuction }) => {
  return !active ? (
    <Button variant="contained" onClick={() => startAuction()}>
      Начать торги
    </Button>
  ) : (
    <Button variant="contained" onClick={() => stopAuction()}>
      Закончить торги
    </Button>
  );
};
