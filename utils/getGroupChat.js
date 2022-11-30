const getGroupChat = (users, currentUserEmail) =>
{
    return users.filter(email => email !== currentUserEmail).length > 1 ? true : false;
}

export default getGroupChat