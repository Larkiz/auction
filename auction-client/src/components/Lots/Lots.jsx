import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../../connection/socket";
import { LotCard } from "../Index/LotCard";
import { Lot } from "../Lot/Lot";

export const Lots = () => {
  const [lots, setLots] = useState([]);

  const [lotOpened, setOpen] = useState(false);

  const lotOpen = (id) => {
    socket.emit("room-check", { id: id });
    setOpen(true);
  };

  const lotClose = (id) => {
    socket.emit("room-leave", { id: id });
    setOpen(false);
  };

  useEffect(() => {
    function roomCreatedHandle(res) {
      setLots(res);
    }
    socket.emit("rooms");
    socket.on("rooms", roomCreatedHandle);

    return () => {
      socket.off("rooms", roomCreatedHandle);
    };
  }, []);

  return (
    <Container maxWidth={false}>
      <Lot open={lotOpened} lotClose={lotClose} />
      {lots.length ? (
        lots.map((lot) => {
          return <LotCard lotOpen={lotOpen} key={lot.id} data={lot} />;
        })
      ) : (
        <Typography variant="h5">Рынок пуст</Typography>
      )}
    </Container>
  );
};
