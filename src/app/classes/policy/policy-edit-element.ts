import {PolicyOcrFragment} from "./policy-ocr-fragment";

export class PolicyEditElement {
  uuid: string;
  file: File;
  jpgPreview: Blob;
  policy: Policy;
  drawItems: DrawItem[];
  confirm: boolean = false;

  create_UUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    this.uuid = uuid;
  }
}

export class DrawItem {
  rectangle: PolicyOcrFragment;
  type: DrawType;
}

export class Policy {
  id: number;
  fromDate: string;
  toDate: string;
  paymentDate: string;
  paidDate: string;
  policyNr: string;
  carName: string;
  carRej: string;
  carVin: string;
  paymentIban: string;
  paymentValue: number;
  toSettlementValue: number;
  toSettlement: boolean;
  pdfPath: string;
  confirmPayPdf: string;
  comment: string;
}

export enum DrawType {
  START_DATE, END_DATE, VIN, REJ, RESIZE, MOVE
}



