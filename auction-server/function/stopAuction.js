export function stopAuction(roomData, timer) {
  clearInterval(timer);

  roomData.end = true;
  roomData.active = false;
  roomData.auctionTime = 0;
  roomData.turnId = null;
  roomData.turnIndex = 0;
  return roomData;
}
