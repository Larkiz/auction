// уже участвует или нет
export function alreadyMember(members, memberId) {
  for (let index = 0; index < members.length; index++) {
    if (members[index].userId === memberId) {
      return true;
    }
  }
  return false;
}
