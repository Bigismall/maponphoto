const arrowIcon = (direction: number): string =>
	`<svg width="400" height="400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(${direction} 12 12)"><path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="#c00000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
const pinIcon: string =
	'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="-3 0 20 20"><path fill="#2c3e50" fill-rule="evenodd" d="M7 9.219a2 2 0 1 1-.001-3.999A2 2 0 0 1 7 9.22M7 0a7 7 0 0 0-7 7c0 3.866 7 13 7 13s7-9.134 7-13a7 7 0 0 0-7-7"/></svg>';
const escapeSVG = (svg: string): string =>
	svg.replace(/[<>#%{}"]/g, (x) => `%${x.charCodeAt(0).toString(16)}`);
export const markerIcon = (direction: number | null) => {
	const dataImagePrefix = "data:image/svg+xml,";
	if (direction == null) {
		return dataImagePrefix + escapeSVG(pinIcon);
	}
	return dataImagePrefix + escapeSVG(arrowIcon(direction));
};
