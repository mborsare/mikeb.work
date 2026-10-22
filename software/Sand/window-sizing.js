function contentBounds(bounds, workArea, contentHeight, anchor = "top-left") {
  const inset = 12;
  const height = Math.max(32, Math.min(Math.round(contentHeight), workArea.height - inset * 2));
  const anchoredY = anchor === "bottom-left" ? bounds.y + bounds.height - height : bounds.y;
  const y = Math.min(Math.max(anchoredY, workArea.y + inset), workArea.y + workArea.height - inset - height);
  return { ...bounds, y, height };
}

module.exports = { contentBounds };
