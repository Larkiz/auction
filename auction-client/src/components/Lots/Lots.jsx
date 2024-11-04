import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../../connection/socket";

import { Lot } from "../Lot/Lot";
import { LotCard } from "../LotCard/LotCard";

export const Lots = () => {
  const [lots, setLots] = useState([]);

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
      <Lot />
      {lots.length ? (
        lots.map((lot) => {
          return <LotCard key={lot.id} data={lot} />;
        })
      ) : (
        <Typography variant="h5">Рынок пуст</Typography>
      )}
    </Container>
  );
};
