document.querySelectorAll("[popovertarget]").forEach((btn) => {
  const parent = btn.closest("[popover]");
  if (parent && parent.id !== btn.getAttribute("popovertarget")) {
    btn.addEventListener("click", () => parent.hidePopover());
  }
});
