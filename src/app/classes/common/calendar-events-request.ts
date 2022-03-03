export class CalendarEventsRequest {
  type: Type;
  id: number;
  dateFrom: string;
  dateTo: string;
  allDay: boolean;
  confirm: boolean;
  deleteWithCommon: boolean;
  resizeAll: boolean;
  removeCommonKey: boolean;
}

export enum Type {
  ADD, EDIT, DELETE, FETCH, RESIZE, MOVE
}
