import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { useSelector } from "react-redux";
import { NewLotModal } from "./NewLot";
import { LotCard } from "./LotCard";
import { Lot } from "../Lot/Lot";
import { useState } from "react";
import { socket } from "../../connection/socket";

export const Index = () => {
  const client = useSelector((store) => store.client.data);

  const [lotOpened, setOpen] = useState(false);

  const lotOpen = (id) => {
    socket.emit("room-check", { id: id });
    setOpen(true);
  };

  const lotClose = (id) => {
    socket.emit("room-leave", { id: id });
    setOpen(false);
  };
  return (
    <Container maxWidth={false}>
      <Typography variant="h4"> {client?.name}</Typography>
      <Lot open={lotOpened} lotClose={lotClose} />
      <NewLotModal userId={client.id} />
      <Stack spacing={2} direction={"row"}>
        {client &&
          client.lots.map((lot) => {
            return <LotCard lotOpen={lotOpen} key={lot.id} data={lot} />;
          })}
      </Stack>
    </Container>
  );
};
