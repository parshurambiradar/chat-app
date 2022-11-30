const getRecipientEmail = (users, currentUserEmail) =>
{
  return users?.filter((userToFilter) => userToFilter !== currentUserEmail)[0]

}

export default getRecipientEmail
