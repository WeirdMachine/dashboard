import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

import {AppConfigService} from '../../../../app-config.service';
import {ApiService, ClusterService, NotificationService, UserService} from '../../../../core/services';
import {AddSshKeyDialogComponent} from '../../../../shared/components/add-ssh-key-dialog/add-ssh-key-dialog.component';
import {ClusterEntity} from '../../../../shared/entity/ClusterEntity';
import {DataCenterEntity} from '../../../../shared/entity/DatacenterEntity';
import {SSHKeyEntity} from '../../../../shared/entity/SSHKeyEntity';
import {UserGroupConfig} from '../../../../shared/model/Config';

@Component({
  selector: 'kubermatic-add-cluster-sshkeys',
  templateUrl: './add-cluster-sshkeys.component.html',
  styleUrls: ['./add-cluster-sshkeys.component.scss'],
})
export class AddClusterSSHKeysComponent implements OnInit, OnDestroy {
  @Input() cluster: ClusterEntity;
  @Input() projectID: string;
  @Input() datacenter: DataCenterEntity;
  @Input() sshKeys: SSHKeyEntity[] = [];

  keys: SSHKeyEntity[] = [];
  keysForm: FormGroup = new FormGroup({
    keys: new FormControl('', [Validators.required]),
  });
  private keysSub: Subscription;
  userGroup: string;
  userGroupConfig: UserGroupConfig;

  constructor(
      private readonly _clusterService: ClusterService, private readonly _dialog: MatDialog,
      private readonly _appConfigService: AppConfigService, private readonly _userService: UserService,
      private readonly _dialogRef: MatDialogRef<AddClusterSSHKeysComponent>, private readonly _api: ApiService,
      private readonly _notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userGroupConfig = this._appConfigService.getUserGroupConfig();
    this._userService.currentUserGroup(this.projectID).subscribe((group) => {
      this.userGroup = group;
    });

    this.reloadKeys();
  }

  ngOnDestroy(): void {
    if (this.keysSub) {
      this.keysSub.unsubscribe();
    }
  }

  reloadKeys(): void {
    this.keysSub = this._api.getSSHKeys(this.projectID).subscribe((sshKeysRes) => {
      const newKeys: SSHKeyEntity[] = [];
      for (const i in sshKeysRes) {
        if (!this.sshKeys.find((x) => x.name === sshKeysRes[i].name)) {
          newKeys.push(sshKeysRes[i]);
        }
      }
      this.keys = newKeys.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });
  }

  addClusterSSHKeys(): void {
    this._clusterService
        .createSSHKey(this.projectID, this.cluster.id, this.datacenter.metadata.name, this.keysForm.controls.keys.value)
        .subscribe((res) => {
          this._notificationService.success(
              `SSH key ${this.keysForm.controls.keys.value} was successfully added to cluster ${this.cluster.name}`);
          this._dialogRef.close(res);
        });
  }

  addProjectSSHKeys(): void {
    const dialogRef = this._dialog.open(AddSshKeyDialogComponent);
    dialogRef.componentInstance.projectID = this.projectID;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.keysSub) {
          this.keysSub.unsubscribe();
        }

        this.reloadKeys();
        this.keysForm.setValue({keys: result.id});
      }
    });
  }
}
