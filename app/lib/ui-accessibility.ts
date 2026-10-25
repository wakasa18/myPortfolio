/** React removes conditional dialogs before passive cleanup; restore focus explicitly. */
export function openProjectDialog(dialog: HTMLDialogElement) {
  const opener = document.activeElement;
  const previousOverflow = document.body.style.overflow;
  dialog.showModal();
  document.body.style.overflow = "hidden";
  return () => {
    dialog.close();
    document.body.style.overflow = previousOverflow;
    if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
  };
}

/** Only keyboard focus should reveal the desktop curtain, never a pointer click. */
export function revealFooterForKeyboard(root: HTMLElement, target: HTMLElement, curtainEnabled: boolean) {
  if (!curtainEnabled || !target.matches(":focus-visible")) return;
  if (root.getBoundingClientRect().top > 0) root.scrollIntoView({ block: "start", behavior: "instant" });
}

export function dismissWhenOutside(root: HTMLElement, dismiss: () => void) {
  const outside = (event: Event) => {
    if (event.target instanceof Node && !root.contains(event.target)) dismiss();
  };
  document.addEventListener("pointerdown", outside);
  document.addEventListener("focusin", outside);
  return () => {
    document.removeEventListener("pointerdown", outside);
    document.removeEventListener("focusin", outside);
  };
}
