import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClusterEntity } from '../../../shared/entity/ClusterEntity';
import { WizardService } from '../../../core/services/wizard/wizard.service';
import { SSHKeyEntity } from '../../../shared/entity/SSHKeyEntity';
import { ApiService, ProjectService, UserService } from '../../../core/services';
import { AppConfigService } from '../../../app-config.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AddSshKeyModalComponent } from '../../../shared/components/add-ssh-key-modal/add-ssh-key-modal.component';
import { ProjectEntity } from '../../../shared/entity/ProjectEntity';
import { UserGroupConfig } from '../../../shared/model/Config';

@Component({
  selector: 'kubermatic-cluster-ssh-keys',
  templateUrl: './cluster-ssh-keys.component.html',
  styleUrls: ['./cluster-ssh-keys.component.scss']
})
export class ClusterSSHKeysComponent implements OnInit, OnDestroy {
  @Input() cluster: ClusterEntity;
  @Input() selectedKeys: SSHKeyEntity[] = [];
  public keys: SSHKeyEntity[] = [];
  public keysForm: FormGroup = new FormGroup({
    keys: new FormControl([], []),
  });
  private keysSub: Subscription;
  private keysFormSub: Subscription;
  public project: ProjectEntity;
  public userGroup: string;
  public userGroupConfig: UserGroupConfig;
  private subscriptions: Subscription[] = [];

  constructor(private api: ApiService,
              private wizardService: WizardService,
              private dialog: MatDialog,
              private projectService: ProjectService,
              private userService: UserService,
              private appConfigService: AppConfigService) { }

  ngOnInit() {
    this.project = this.projectService.project;

    this.subscriptions.push(this.projectService.selectedProjectChanges$.subscribe(project => {
      this.project = project;
      this.userGroupConfig = this.appConfigService.getUserGroupConfig();
      this.userService.currentUserGroup(this.project.id).subscribe(group => {
        this.userGroup = group;
      });
    }));

    const keyNames: string[] = [];
    for (const key of this.selectedKeys) {
      keyNames.push(key.name);
    }
    this.keysForm.controls.keys.patchValue(keyNames);

    this.keysFormSub = this.keysForm.valueChanges.subscribe(data => {
      const clusterKeys: SSHKeyEntity[] = [];
      for (const selectedKey of this.keysForm.controls.keys.value) {
        for (const key of this.keys) {
          if (selectedKey === key.name) {
            clusterKeys.push(key);
          }
        }
      }
      this.wizardService.changeClusterSSHKeys(clusterKeys);
    });

    this.reloadKeys();
  }

  ngOnDestroy() {
    this.keysSub.unsubscribe();
    this.keysFormSub.unsubscribe();
  }

  reloadKeys() {
    this.keysSub = this.api.getSSHKeys(this.project.id).subscribe(sshKeys => {
      this.keys = sshKeys.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });
  }

  public addSshKeyDialog(): void {
    const dialogRef = this.dialog.open(AddSshKeyModalComponent);
    dialogRef.componentInstance.projectID = this.project.id;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.keysSub) {
          this.keysSub.unsubscribe();
        }

        this.reloadKeys();

        this.keysForm.setValue({
          keys: [result.name]
        });
      }
    });
  }
}
