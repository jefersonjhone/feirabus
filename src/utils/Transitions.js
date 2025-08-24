export const scrollToElement = (
  current,
  behavior = 'smooth',
  block = 'center',
  inline = 'nearest'
) => {
  if (current !== null && current !== undefined) {
    current.scrollIntoView({
      behavior: behavior,
      block: block,
      inline: inline,
    })
  }
}
