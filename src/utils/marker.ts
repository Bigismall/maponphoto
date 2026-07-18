const arrowIcon = (direction: number): string =>
  `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(${direction} 12 12)"><path d="M7 20.6622C4.01099 18.9331 2 15.7014 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 15.7014 19.989 18.9331 17 20.6622M16 12.0001L12 8.00007M12 8.00007L8 12.0001M12 8.00007V22.0001" stroke="#c00000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;

const pinIcon: string =
  '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 14.2864C3.14864 15.1031 2 16.2412 2 17.5C2 19.9853 6.47715 22 12 22C17.5228 22 22 19.9853 22 17.5C22 16.2412 20.8514 15.1031 19 14.2864M18 8C18 12.0637 13.5 14 12 17C10.5 14 6 12.0637 6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8ZM13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8Z" stroke="#c00000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const escapeSVG = (svg: string): string =>
  svg.replace(/[<>#%{}"]/g, (x) => `%${x.charCodeAt(0).toString(16)}`);

export const markerIcon = (direction: number | null) => {
  const dataImagePrefix = "data:image/svg+xml,";
  if (direction == null) {
    return dataImagePrefix + escapeSVG(pinIcon);
  }
  return dataImagePrefix + escapeSVG(arrowIcon(direction));
};
