import { Container, Stack, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { NewLotModal } from "./NewLot";
import { LotCard } from "../LotCard/LotCard";
import { Lot } from "../Lot/Lot";

export const Index = () => {
  const client = useSelector((store) => store.client.data);

  return (
    <Container maxWidth={false}>
      <Typography variant="h4"> {client?.name}</Typography>
      <Lot />
      <NewLotModal userId={client.id} />
      <Stack spacing={2} direction={"row"}>
        {client &&
          client.lots.map((lot) => {
            return <LotCard key={lot.id} data={lot} />;
          })}
      </Stack>
    </Container>
  );
};
