import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilePickerComponent } from '../file-picker/file-picker.component';
import { Candidature, Contest } from '../../state/contest.model';
import { ReadFile } from 'ngx-file-helpers';
import { IpfsService } from 'ng-web3';

@Component({
  selector: 'cc-create-candidature',
  templateUrl: './create-candidature.component.html',
  styleUrls: ['./create-candidature.component.css']
})
export class CreateCandidatureComponent {
  candidatureForm: FormGroup;
  @ViewChild('filePicker')
  filePicker: FilePickerComponent;
  upload = false;
  loadingIpfs = false;

  constructor(
    public dialogRef: MatDialogRef<CreateCandidatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean,
    private formBuilder: FormBuilder,
    private ipfsService: IpfsService
  ) {
    if (!data) this.buildForm();
    this.upload = data;
  }

  private buildForm() {
    this.candidatureForm = this.formBuilder.group({
      title: ['', Validators.required],
      contentHash: ['', Validators.required]
    });
  }

  cancel($event) {
    this.dialogRef.close();
  }

  createCandidature() {
    if (this.upload) {
      const candidature: Candidature = {
        title: null,
        creator: null,
        date: null,
        content: {
          content: new Buffer(this.filePicker.file.content),
          hash: null
        },
        votes: 0,
        cancelled: false
      };
      this.dialogRef.close(candidature);
    } else {
      this.candidatureForm.get('contentHash').enable();

      const candidature: Candidature = {
        title: this.candidatureForm.value.title,
        creator: null,
        date: null,
        content: {
          hash: this.candidatureForm.value.contentHash
        },
        votes: 0,
        cancelled: false
      };
      this.dialogRef.close(candidature);
    }
  }

  hashEnabled(): boolean {
    return this.filePicker.file && this.filePicker.file.content;
  }

  fileRead(file: ReadFile) {
    if (!this.upload) {
      this.candidatureForm.get('contentHash').disable();
      this.loadingIpfs = true;
      this.ipfsService
        .add(new Buffer(file.content), { onlyHash: true })
        .then((fileReceipt: any) => {
          this.loadingIpfs = false;
          this.candidatureForm.patchValue({
            contentHash: fileReceipt[0].hash
          });
          this.candidatureForm.updateValueAndValidity();
        }); // TODO: ADD ERROR
    }
  }

  fileRemoved() {
    this.candidatureForm.get('contentHash').enable();
  }
}
