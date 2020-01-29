function getElementTextById(id: string) {
  const element = document.getElementById(id);

  return element && element.textContent !== null
    ? element.textContent
    : '';
}

/**
 * Make email anchor a clickable link.
 *
 * We're making spam bots work a little harder by avoiding writing a literal
 * email address anywhere, but we still want it clickable by humans.
 */
export function linkifyEmail() {
  const firstName = getElementTextById('first-name').toLowerCase();
  const lastName = getElementTextById('last-name').toLowerCase();

  if (firstName && lastName) {
    const outputElement = document.querySelector('.email') as HTMLAnchorElement;
    const email = `${firstName}@${firstName}${lastName}.com`;

    outputElement.href = `mailto:${email}`;
    outputElement.textContent = email;
  }
}
