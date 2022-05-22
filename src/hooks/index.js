export const usePosition = (nodeElement) => {
  const {top, right, bottom, left, height, width, x, y} = nodeElement.getBoundingClientRect()
  return {top, right, bottom, left, height, width, x, y}
}