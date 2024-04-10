export interface Booking {
    id: number;
    user_id: number;
    listing_id: number;
    start_date: Date;
    end_date: Date;
    status: string;
}
