import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormInput } from 'src/app/crud-maker/model/input';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
})
export class InputFileComponent implements OnInit {
  @Input() data: FormInput;
  @Input() isForm = true;
  @Input() forceReadOnly = false;
  @Input() forceValidation = false;
  public keys = Object.keys;
  constructor(
    private elementRef: ElementRef,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {}

  public trackById = (index: number, item: any): string => {
    return `${index}`;
  };

  onFileSelect(event: any) {
    this.data.value = event?.target?.files[0];
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}
