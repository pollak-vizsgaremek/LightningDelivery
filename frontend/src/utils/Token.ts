function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

function decryptToken(token: string): any {
  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
}

function getSubjectFromToken(token: string): string | null {
  const decryptedToken = decryptToken(token);
  return decryptedToken ? decryptedToken.sub : null;
}

// function get