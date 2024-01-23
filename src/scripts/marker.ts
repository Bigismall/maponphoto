const arrowIcon = (direction: number) => `<svg width="400px" height="400px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(${direction} 12 12)"><path d="M12 4V20M12 4L8 8M12 4L16 8" stroke="#c00000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;

export const markerIcon = (direction: number) => `data:image/svg+xml,${arrowIcon(direction)}`.replace(/[<>#%{}"]/g, (x) => '%' + x.charCodeAt(0).toString(16));
