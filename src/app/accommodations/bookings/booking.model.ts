export interface Booking {
    id: string;
    user_id: string;
    listing_id: string;
    start_date: Date;
    end_date: Date;
    status: string;
}
