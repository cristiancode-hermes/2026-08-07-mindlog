export declare class CreateEntryDto {
    date: string;
    content: string;
    title?: string;
    mood?: number;
    tagIds?: string[];
}
export declare class UpdateEntryDto {
    content?: string;
    title?: string;
    mood?: number;
    tagIds?: string[];
}
