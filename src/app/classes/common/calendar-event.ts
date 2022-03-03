import * as moment from "moment";
import {User} from "./user";

export class CalendarEvent {
  id: number;
  dateFrom: string;
  dateTo: string;
  color: string;
  commonKey: string;
  allDay: boolean;
  title: string;
  description: string;
  icon: string;
  user: User;
  manager: User;

  public static dateFromString(stringDate: string): Date {
    return moment(stringDate).toDate();
  }

  public static stringFromDate(date: Date): string {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
}
