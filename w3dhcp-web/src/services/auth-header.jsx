export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

return user
//  if (user && user.accessToken) {
    // For Spring Boot back-end
    // return { Authorization: "Bearer " + user.accessToken };

    // for Node.js Express back-end
//    return { "-token": user.accessToken };
//  } else {
//    return {};
//  }
}
