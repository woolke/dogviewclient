import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'src/app/classes/common/user';
import {TokenStorageService} from "../../../services/auth/token-storage.service";
import {CalendarEvent} from "../../../classes/common/calendar-event";
import {MatSelect} from '@angular/material/select';
import {CalendarService} from "../../../services/calendar.service";
import {CalendarEventsRequest} from "../../../classes/common/calendar-events-request";


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal,
              public tokenStorage: TokenStorageService,
              private calendarService: CalendarService) {
  }

  id: number;
  commonKey: string;
  title = new FormControl();
  decription = new FormControl();
  icon = new FormControl();
  color: string;
  user: User;
  manager: User;
  users: User[] = [];
  mangers: User[] = [];
  allDay = new FormControl(Boolean);
  startDate = new FormControl(Date);
  endDate = new FormControl(Date);

  ngOnInit(): void {
    const user1 = new User();
    user1.id = 3;
    user1.username = "testowy";
    this.users.push(user1);
    this.user = this.tokenStorage.getUser().user;
    this.users.push(this.tokenStorage.getUser().user);
    this.manager = this.tokenStorage.getUser().manager;
    this.mangers.push(this.tokenStorage.getUser().manager);
  }

  save(): void {
    const calendarEvent = new CalendarEvent();
    calendarEvent.id = this.id;
    calendarEvent.dateFrom = CalendarEvent.stringFromDate(this.startDate.value);
    calendarEvent.dateTo = CalendarEvent.stringFromDate(this.endDate.value);
    calendarEvent.color = this.color;
    calendarEvent.commonKey = this.commonKey;
    calendarEvent.allDay = this.allDay.value;
    calendarEvent.title = this.title.value;
    // calendarEvent.icon = this.icon.value;
    calendarEvent.user = this.user;
    calendarEvent.manager = this.manager;
    console.log(JSON.stringify(calendarEvent));

    this.calendarService.save(calendarEvent).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.activeModal.close();
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );
  }

  setUser(id: number, type: string): void {
    if (type === 'manager') {
      this.manager = this.mangers.find(x => x.id === id);
    } else {
      this.user = this.users.find(x => x.id === id);
    }
  }
}
