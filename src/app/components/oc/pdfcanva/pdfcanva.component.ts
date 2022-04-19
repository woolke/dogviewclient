import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgxFileDropEntry} from 'ngx-file-drop';
import {PdfcanvaService} from "../../../services/pdfcanva.service";
import {DrawItem, PolicyEditElement} from "../../../classes/policy/policy-edit-element";
import {PolicyOcrFragment} from "../../../classes/policy/policy-ocr-fragment";
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-pdfcanva',
  templateUrl: './pdfcanva.component.html',
  styleUrls: ['./pdfcanva.component.css']
})
export class PdfcanvaComponent implements OnInit {
  constructor(private service: PdfcanvaService,
              private notifierService: NotifierService) {
  }

  inputPolicyNrValue: string = '';
  inputCarNameValue: string = '';
  inputRejValue: string = '';
  inputVinValue: string = '';
  inputFromValue: string = '';
  inputToValue: string = '';
  inputPaymentValueValue: string = '';
  inputPaymentDateValue: string = '';

  @ViewChild("myCanvas") myCanvas: ElementRef;
  startX: number = null;
  startY: number = null;
  pdfElements: PolicyEditElement[] = [];
  currentElement: PolicyEditElement;
  currentInput: any;
  drag = false;
  public files: NgxFileDropEntry[] = [];
  public dropped(files: NgxFileDropEntry[]) {
    this.files.push(...files);
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const policyEditElement = new PolicyEditElement();
          policyEditElement.file = file;
          policyEditElement.drawItems = [];
          policyEditElement.create_UUID();
          console.log(droppedFile.relativePath, file);
          const formData = new FormData();
          formData.append('file', file, droppedFile.relativePath);
          formData.append('width', this.myCanvas.nativeElement.parentNode.offsetWidth);
          formData.append('uuid', policyEditElement.uuid);
          console.log(formData);
          this.service.preview(formData).subscribe(result => {
            this.convertBlob(result.jpgPreview);
            policyEditElement.jpgPreview = result.jpgPreview;
            policyEditElement.policy = result.policy;
            this.pdfElements.push(policyEditElement);
            this.currentElement = policyEditElement;
            this.inputPolicyNrValue = result.policy.policyNr;
            this.inputCarNameValue = result.policy.carName;
            this.inputRejValue = result.policy.carRej;
            this.inputVinValue = result.policy.carVin;
            this.inputFromValue = result.policy.fromDate;
            this.inputToValue = result.policy.toDate;
            this.inputPaymentValueValue = result.policy.paymentValue.toString();
            this.inputPaymentDateValue = result.policy.paymentDate;
          });
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  mdEvent(e) {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.drag = true;
  }

  mmEvent(e) {

    if (this.drag) {
      const baseImage = new Image();
      baseImage.src = 'data:image/jpg;base64,'+this.currentElement.jpgPreview;
      const context: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext("2d");
      const sx = this.startX;
      const sy = this.startY;

      const canvasTop = this.myCanvas.nativeElement.getBoundingClientRect().top;
      const canvasLeft = this.myCanvas.nativeElement.getBoundingClientRect().left;
      const x = sx - canvasLeft;
      const y = sy - canvasTop;
      const w = e.clientX - canvasLeft - x;
      const h = e.clientY - canvasTop - y;
      baseImage.onload = () => {
        context.canvas.height = baseImage.height;
        context.canvas.width = baseImage.width;
        context.drawImage(baseImage, 0, 0);
        context.setLineDash([6]);
        context.strokeRect(x, y, w, h);
      };


    }
  }

  convertBlob(blob:Blob) {
    // console.log(URL.createObjectURL(blob));
    const baseImage = new Image();
    baseImage.src = 'data:image/jpg;base64,'+blob;
    const context: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext("2d");
    baseImage.onload = () => {
      context.canvas.height = baseImage.height;
      context.canvas.width = baseImage.width;
      context.drawImage(baseImage, 0, 0);
    };
  }
  changeFile(element:PolicyEditElement){
    this.convertBlob(element.jpgPreview);
    this.currentElement = element;
    this.inputPolicyNrValue = element.policy.policyNr;
    this.inputCarNameValue = element.policy.carName;
    this.inputRejValue = element.policy.carRej;
    this.inputVinValue = element.policy.carVin;
    this.inputFromValue = element.policy.fromDate;
    this.inputToValue = element.policy.toDate;
    this.inputPaymentValueValue = element.policy.paymentValue.toString();
    this.inputPaymentDateValue = element.policy.paymentDate;
  }

  muEvent(e) {
    const x = this.startX - this.myCanvas.nativeElement.getBoundingClientRect().left;
    const y = this.startY - this.myCanvas.nativeElement.getBoundingClientRect().top;
    const w = e.clientX - this.myCanvas.nativeElement.getBoundingClientRect().left - x;
    const h = e.clientY - this.myCanvas.nativeElement.getBoundingClientRect().top - y;
    const drawItem = new DrawItem();
    drawItem.rectangle = {
      x, y, width: w, height: h,
      uuid: this.currentElement.uuid,
      previewH: this.myCanvas.nativeElement.height,
      previewW: this.myCanvas.nativeElement.width,
      text: ''
    };
    this.currentElement.drawItems.push(drawItem);
    this.readOcr(drawItem.rectangle);
    this.drag = false;
  }

  readOcr(fragment: PolicyOcrFragment) {
    this.service.ocrRead(fragment).subscribe(result => {
      console.log(result.text);
      this.notifierService.notify('success', result.text);
      if (this.currentInput != null) {
        this.currentInput.value = result.text;
      }
      // context.setLineDash([6]);
      const context = this.myCanvas.nativeElement.getContext("2d");
      for (const item of this.currentElement.drawItems) {
        context.beginPath();
        context.rect(item.rectangle.x, item.rectangle.y, item.rectangle.width, item.rectangle.height);
        context.stroke();
      }
    });
  }

  log(e, log: string) {
    alert(e);
    e.preventDefault();
  }

  focus(element:HTMLInputElement){
    this.currentInput = element;
  }

  ngOnInit() {
    this.notifierService.getConfig().position.horizontal.position = 'right';
  }
}
