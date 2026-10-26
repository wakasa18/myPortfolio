/** Browser-based compose avoids relying on an installed mailto handler. */
export function getGmailComposeHref(email: string) {
  const url = new URL("https://mail.google.com/mail/");
  url.searchParams.set("view", "cm");
  url.searchParams.set("fs", "1");
  url.searchParams.set("to", email);
  return url.href;
}
