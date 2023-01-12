/** @format */

export async function createNewUser(
  email: string,
  password: string
): Promise<object> {
  const newUser = await fetch("http://localhost:1337/api/auth/local/register", {
    method: "POST",
    body: JSON.stringify({
      username: email,
      email: email,
      password: password,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => data);
  return newUser;
}

interface User {
  jwt: string;
  username: string;
}
export async function getMyUser(jwt: string): Promise<User> {
  const user = await fetch("http://localhost:1337/api/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<object> {
  const user = await fetch("http://localhost:1337/api/auth/local", {
    method: "POST",
    body: JSON.stringify({
      identifier: email,
      password: password,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => data);
  return user;
}
