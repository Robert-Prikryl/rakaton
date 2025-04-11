export interface TimelinePoint extends Record {
    date: Date;
    color?: string;
    description: string;
}

export interface TimelineRange extends Record {
    startDate: Date;
    endDate: Date;
    color?: string;
    description: string;
}

export interface Record {
    id: string;
    data: string;
}