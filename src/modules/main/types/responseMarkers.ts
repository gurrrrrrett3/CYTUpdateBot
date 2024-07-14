export type ResponseMarkers = MarkerGroup[];

export interface MarkerGroup {
    hide: boolean;
    z_index: number;
    name: string;
    control: boolean;
    id: string;
    markers: Marker[];
    order: number;
    timestamp: number;
}

export interface Marker {
    tooltip_anchor?: MarkerPosition;
    popup?: string;
    size?: MarkerPosition;
    anchor?: MarkerPosition;
    tooltip: string;
    icon?: string;
    type: string;
    point?: MarkerPosition;
    fillColor?: string;
    color?: string;
    points?: MarkerPosition[];
}

export interface MarkerPosition {
    z: number;
    x: number;
}