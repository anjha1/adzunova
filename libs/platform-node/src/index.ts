export interface EventMetadata {
  eventId: string;
  eventType: string;
  eventVersion: number;
  correlationId?: string;
  causationId?: string;
  cellId: string;
}
