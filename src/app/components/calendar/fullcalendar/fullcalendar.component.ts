import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  DatesSetArg,
  EventApi,
  EventClickArg,
  EventDropArg,
  EventInput,
  FullCalendarComponent
} from '@fullcalendar/angular';
import {MatMenuTrigger} from '@angular/material/menu';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {EventEditComponent} from "../event-edit/event-edit.component";
import {FormControl} from '@angular/forms';
import {CalendarEvent} from "../../../classes/common/calendar-event";
import {CalendarEventsRequest, Type} from "../../../classes/common/calendar-events-request";
import {CalendarService} from "../../../services/calendar.service";
import {DialogComponent} from "../dialog/dialog.component";
import {EventResizeDoneArg, EventResizeStartArg, EventDragStopArg} from '@fullcalendar/interaction';

@Component({
  selector: 'app-fullcalendar',
  templateUrl: './fullcalendar.component.html',
  styleUrls: ['./fullcalendar.component.css']
})
export class FullcalendarComponent implements OnInit {
  constructor(private modalService: NgbModal,
              private calendarServce: CalendarService,
              private renderer2: Renderer2) {
  }

  menuTopLeftPosition = {x: 0, y: 0};
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;
  eventColor = '#dd5500';
  eventsRequest = new CalendarEventsRequest();
  events: CalendarEvent[];
  calendarOptions: CalendarOptions = {
    eventColor: this.eventColor,
    initialView: 'timeGridWeek',
    timeZone: 'none',
    locale: 'pl',
    selectable: true,
    editable: true,
    height: window.innerHeight - 50,
    select: this.eventSelect.bind(this),
    eventClick: this.eventClick.bind(this),
    datesSet: this.datesSet.bind(this),
    eventResizeStart: this.resizeStart.bind(this),
    eventResize: this.resize.bind(this),
    // eventDragStop: this.move.bind(this),
    // dateClick: this.logListeners.bind(this, 'dateClick'),
    // eventsSet: this.logListeners.bind(this, 'eventsSet'),
    // eventAdd: this.logListeners.bind(this, 'eventAdd'),
    // loading: this.logListeners.bind(this, 'loading'),
    // eventMouseEnter: this.logListeners.bind(this, 'eventMouseEnter'),
    // eventMouseLeave: this.logListeners.bind(this, 'eventMouseLeave'),
    // unselect: this.logListeners.bind(this, 'unselect'),
    // _unmount: this.logListeners.bind(this, '_unmount'),
    // _beforeprint: this.logListeners.bind(this, '_beforeprint'),
    // _afterprint: this.logListeners.bind(this, '_afterprint'),
    // _noEventDrop: this.logListeners.bind(this, '_noEventDrop'),
    // _noEventResize: this.logListeners.bind(this, '_noEventResize'),
    // _resize: this.logListeners.bind(this, '_resize'),
    // _scrollRequest: this.logListeners.bind(this, '_scrollRequest'),
    // eventDragStart: this.logListeners.bind(this, 'eventDragStart'),
    eventDrop: this.move.bind(this),
    // eventResizeStop: this.logListeners.bind(this, 'eventResizeStop'),
    // drop: this.logListeners.bind(this, 'drop'),
    // eventReceive: this.logListeners.bind(this, 'eventReceive'),
    // eventLeave: this.logListeners.bind(this, 'eventLeave'),
    events: [],
    customButtons: {
      myCustomButton: {
        text: 'custom!',
        click() {
          alert('clicked the custom button!');
        }
      }
    },
    headerToolbar: {
      left: 'prev,next today myCustomButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    }
  };
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  ngOnInit(): void {
  }

  logListeners(arg, fun) { // handler method
    console.log(arg.toString() + ' [' + JSON.stringify(fun) + ']');
  }

  eventSelect(event: DateSelectArg) {
    const allDay = event.allDay;
    const startDate = new Date(Date.parse(event.start.toUTCString().replace(' GMT', '')));
    let endDate = new Date(Date.parse(event.end.toUTCString().replace(' GMT', '')));
    endDate = this.substractDayForAllDay(event.allDay, endDate);
    this.openEditModal(null, 'Zadanie', null, allDay, startDate, endDate, null, this.eventColor);
  }

  private substractDayForAllDay(allDay: boolean, endDate: Date) {
    if (allDay) {
      endDate = new Date(endDate.setDate(endDate.getDate() - 1));
    }
    return endDate;
  }

  eventClick(event: EventClickArg) {

    this.menuTopLeftPosition.x = event.jsEvent.x;
    this.menuTopLeftPosition.y = event.jsEvent.y;
    this.matMenuTrigger.menuData = {item: event.event};
    // event.event._def.ui.backgroundColor = 'green';
    // event.event._def.ui.textColor = '#aabbcc';

    event.event._def.ui.classNames = Object.assign([]);
    event.event._def.ui.classNames.push('lighter');
    this.addClassToCommonEvents(event.event._def.extendedProps.commonKey, 'lighter');

    const myEvent = [];
    const api = this.calendarComponent.getApi();
    api.refetchEvents();
    api.addEventSource(myEvent);
    this.matMenuTrigger.openMenu();
    const el = document.getElementById("contextMenu").parentElement.parentElement;
    const backgroundColor = event.event.backgroundColor === '' ? this.eventColor : event.event.backgroundColor;
    this.renderer2.setStyle(el, 'background', 'linear-gradient(90deg, rgba(255,255,255,1) 0%, ' + backgroundColor + ' 100%)');
  }

  addClassToCommonEvents(commonKey: string, className: string) {
    const api = this.calendarComponent.getApi();
    api.getEvents().forEach(event => {
      event._def.ui.classNames = Object.assign([]);
      if (event.extendedProps.commonKey === commonKey) {
        event._def.ui.classNames.push(className);
      }
    });
  }


  removeClassFromCommonEvents(commonKey: string, className: string) {
    const api = this.calendarComponent.getApi();
    api.getEvents().forEach(event => {
        if (event.extendedProps.commonKey === commonKey) {
          try {
            event._def.ui.classNames = event._def.ui.classNames.filter(element => element !== className);
          } catch {
          }
        }
      }
    );
  }

  alert(value: string) {
    alert(value);
  }

  datesSet(event: DatesSetArg) {
    this.eventsRequest.dateFrom = event.startStr.replace('T', ' ');
    this.eventsRequest.dateTo = event.endStr.replace('T', ' ');
    this.subscribeEventsFromServer();
  }

  private subscribeEventsFromServer() {
    this.calendarServce.getEvents(this.eventsRequest).subscribe(
      data => {
        this.events = [];
        this.events = data;
        this.calendarComponent.getApi().removeAllEvents();
        this.calendarComponent.getApi().addEventSource(this.parseFCEventList(this.events));
        this.calendarComponent.getApi().refetchEvents();
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  delete(item: EventApi): void {
    const request = new CalendarEventsRequest();
    // tslint:disable-next-line:radix
    request.id = Number.parseInt(item.id);
    request.type = Type.DELETE;
    this.calendarServce.delete(request).subscribe(
      data => {
        this.openDialogModal(request, data);
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  resize(item: EventResizeDoneArg): void {
    const request = new CalendarEventsRequest();
    // tslint:disable-next-line:radix
    request.id = Number.parseInt(item.event.id);
    request.dateTo = item.event.endStr.replace('T', ' ');
    request.type = Type.RESIZE;
    this.calendarServce.resize(request).subscribe(
      data => {
        if (data === 'CONFIRM' || data === 'CONFIRM_MULTI') {
          this.openDialogModal(request, data);
        } else {
          this.subscribeEventsFromServer();
        }
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  move(item: EventDropArg): void {
    const request = new CalendarEventsRequest();
    // tslint:disable-next-line:radix
    request.id = Number.parseInt(item.event.id);
    request.allDay = item.event.allDay;
    request.dateFrom = item.event.startStr.replace('T', ' ');
    request.dateTo = item.event.endStr.replace('T', ' ');
    request.type = Type.MOVE;
    this.calendarServce.move(request).subscribe(
      data => {
        if (data === 'CONFIRM' || data === 'CONFIRM_MULTI') {
          this.openDialogModal(request, data);
        } else {
          this.subscribeEventsFromServer();
        }
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  resizeStart(event: EventResizeStartArg) {
    this.addClassToCommonEvents(event.event.extendedProps.commonKey, 'calendar-event-bordered');
  }

  editEvent(item: EventApi) {
    // tslint:disable-next-line:radix
    const id = Number.parseInt(item.id);
    const allDay = item.allDay;
    const title = item.title;
    const icon = item.extendedProps.icon;
    const description = item.extendedProps.description;
    const startDate = new Date(Date.parse(item._instance.range.start.toUTCString().replace(' GMT', '')));
    let endDate = new Date(Date.parse(item._instance.range.end.toUTCString().replace(' GMT', '')));
    endDate = this.substractDayForAllDay(allDay, endDate);
    const backgroundColor = this.getEventColor(item);
    this.openEditModal(id, title, description, allDay, startDate, endDate, icon, backgroundColor);
  }

  getEventColor(event: EventApi) {
    return event.backgroundColor === '' ? this.eventColor : event.backgroundColor;
  }

  openEditModal(id: number, title: string, description: string, allDay: boolean, startDate: Date, endDate: Date,
                icon: string, color: string) {
    const options: NgbModalOptions = {
      size: 'lg',
      centered: true
    };
    const modalRef = this.modalService.open(EventEditComponent, options);
    modalRef.componentInstance.allDay = new FormControl(allDay);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.title = new FormControl(title);
    modalRef.componentInstance.description = new FormControl(description);
    modalRef.componentInstance.icon = icon;
    modalRef.componentInstance.endDate = new FormControl(endDate);
    modalRef.componentInstance.startDate = new FormControl(startDate);
    modalRef.componentInstance.color = color;
    modalRef.closed.subscribe(
      data => {
        this.subscribeEventsFromServer();
      }
    );
  }

  openDialogModal(request: CalendarEventsRequest, response: string) {
    const options: NgbModalOptions = {
      size: 'lg',
      centered: true
    };
    const modalRef = this.modalService.open(DialogComponent, options);
    modalRef.componentInstance.request = request;
    modalRef.componentInstance.response = response;
    modalRef.componentInstance.isDelete = request.type === Type.DELETE;
    modalRef.componentInstance.isResize = request.type === Type.RESIZE;
    modalRef.componentInstance.isMove = request.type === Type.MOVE;
    modalRef.closed.subscribe(
      data => {
        this.subscribeEventsFromServer();
      }
    );
  }

  parseFCEvent(event: CalendarEvent): EventInput {
    const myEvent: EventInput = {};
    myEvent.id = event.id.toString();
    myEvent.start = event.dateFrom;
    myEvent.end = event.dateTo;
    myEvent.allDay = event.allDay;
    myEvent.title = event.title;
    myEvent.backgroundColor = event.color;
    myEvent.extendedProps = [];
    myEvent.extendedProps.description = event.description;
    myEvent.extendedProps.commonKey = event.commonKey;
    return myEvent;
  }

  parseFCEventList(events: CalendarEvent[]): EventInput[] {
    const eventSource: EventInput[] = [];
    for (const event of events) {
      eventSource.push(this.parseFCEvent(event));
    }
    return eventSource;
  }
}

// datesSet: Identity<(arg: DatesSetArg) => void>;
// eventsSet: Identity<(events: EventApi[]) => void>;
// eventAdd: Identity<(arg: EventAddArg) => void>;
// eventChange: Identity<(arg: EventChangeArg) => void>;
// eventRemove: Identity<(arg: EventRemoveArg) => void>;
// windowResize: Identity<(arg: {
//   view: ViewApi;
// }) => void>;
// eventClick: Identity<(arg: EventClickArg) => void>;
// eventMouseEnter: Identity<(arg: EventHoveringArg) => void>;
// eventMouseLeave: Identity<(arg: EventHoveringArg) => void>;
// select: Identity<(arg: DateSelectArg) => void>;
// unselect: Identity<(arg: DateUnselectArg) => void>;
// loading: Identity<(isLoading: boolean) => void>;
// _unmount: Identity<() => void>;
// _beforeprint: Identity<() => void>;
// _afterprint: Identity<() => void>;
// _noEventDrop: Identity<() => void>;
// _noEventResize: Identity<() => void>;
// _resize: Identity<(forced: boolean) => void>;
// _scrollRequest: Identity<(arg: any) => void>;

// dateClick: Identity<(arg: DateClickArg) => void>;
// eventDragStart: Identity<(arg: EventDragStartArg) => void>;
// eventDragStop: Identity<(arg: EventDragStopArg) => void>;
// eventDrop: Identity<(arg: EventDropArg) => void>;
// eventResizeStart: Identity<(arg: EventResizeStartArg) => void>;
// eventResizeStop: Identity<(arg: EventResizeStopArg) => void>;
// eventResize: Identity<(arg: EventResizeDoneArg) => void>;
// drop: Identity<(arg: DropArg) => void>;
// eventReceive: Identity<(arg: EventReceiveArg) => void>;
// eventLeave: Identity<(arg: EventLeaveArg) => void>;

// extendedProps: Identity<Dictionary>;
// start: Identity<DateInput>;
// end: Identity<DateInput>;
// date: Identity<DateInput>;
// allDay: BooleanConstructor;
// id: StringConstructor;
// groupId: StringConstructor;
// title: StringConstructor;
// url: StringConstructor;
// interactive: BooleanConstructor;
// display: StringConstructor;
// editable: BooleanConstructor;
// startEditable: BooleanConstructor;
// durationEditable: BooleanConstructor;
// constraint: Identity<any>;
// overlap: Identity<boolean>;
// allow: Identity<AllowFunc>;
// className: typeof parseClassNames;
// classNames: typeof parseClassNames;
// color: StringConstructor;
// backgroundColor: StringConstructor;
// borderColor: StringConstructor;
// textColor: StringConstructor;
