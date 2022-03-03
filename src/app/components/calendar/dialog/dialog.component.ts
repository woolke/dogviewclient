import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../../../services/auth/token-storage.service";
import {CalendarService} from "../../../services/calendar.service";
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CalendarEventsRequest, Type} from "../../../classes/common/calendar-events-request";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              public tokenStorage: TokenStorageService,
              private calendarService: CalendarService) {
  }
  request: CalendarEventsRequest;
  response: string;
  isDelete: boolean;
  isResize: boolean;
  isMove: boolean;

  ngOnInit(): void {
  }

  setRequest(request: CalendarEventsRequest) {
    this.request = request;
  }

  deleteClose(result: string) {
    if (result == null || result === "NO" || result === 'CLOSE') {
      this.activeModal.close();
    } else if (result === 'DELETE_OK') {
      this.request.confirm = true;
    } else if (result === 'DELETE_SINGLE') {
      this.request.confirm = true;
      this.request.deleteWithCommon = false;
    } else if (result === 'DELETE_ALL') {
      this.request.confirm = true;
      this.request.deleteWithCommon = true;
    }
    this.calendarService.delete(this.request).subscribe(
      data => {
        this.activeModal.close();
      },
      err => {
        console.log(err);
        this.activeModal.close();
      }
    );
  }

  resizeClose(result: string) {
    if (result == null || result === "NO" || result === 'CLOSE') {
      this.activeModal.close();
    } else if (result === 'RESIZE_SINGLE') {
      this.request.confirm = true;
      this.request.resizeAll = false;
    } else if (result === 'RESIZE_ALL') {
      this.request.confirm = true;
      this.request.resizeAll = true;
    }
    this.calendarService.resize(this.request).subscribe(
      data => {
        this.activeModal.close();
      },
      err => {
        console.log(err);
        this.activeModal.close();
      }
    );
  }

  moveClose(result: string) {
    if (result == null || result === "NO" || result === 'CLOSE') {
      this.activeModal.close();
    } else if (result === 'REMOVE_COMMON_KEY') {
      this.request.confirm = true;
      this.request.removeCommonKey = true;
    } else if (result === 'DONT_CHANGE_COMMON_KEY') {
      this.request.confirm = true;
      this.request.removeCommonKey = false;
    }
    this.calendarService.move(this.request).subscribe(
      data => {
        this.activeModal.close();
      },
      err => {
        console.log(err);
        this.activeModal.close();
      }
    );
  }

}
