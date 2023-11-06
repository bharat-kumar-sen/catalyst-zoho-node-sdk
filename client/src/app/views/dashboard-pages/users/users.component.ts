import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { jsonData } from '../../../shared-ui/json/json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService, UsersService } from 'src/app/shared-ui';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  userList: any[] = [];

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  profileImage: any = null;

  selectedFiles?: FileList;

  currentFile?: File;

  submitted = false;

  customStart = 0;

  currentUser: any = {};

  editcurrentUser: any = {};

  userForm: any = new FormGroup({
    ROWID: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    role: new FormControl(''),
    company_name: new FormControl(''),
    image: new FormControl(''),
    address: new FormControl(''),
    phone_number: new FormControl(''),
  });

  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  @ViewChild('addUserModal', { static: false })
  public addUserModal: any = ModalDirective;

  @ViewChild('userInfoModal', { static: false })
  public userInfoModal: any = ModalDirective;

  @ViewChild('editUserModal', { static: false })
  public editUserModal: any = ModalDirective;

  @ViewChild('deleteUserModal', { static: false })
  public deleteUserModal: any = ModalDirective;

  constructor(
    private globalService: GlobalService,
    private spinner: NgxSpinnerService,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.getUsersList();
    this.dtOptions = {
      // pagingType: 'full_numbers',
      responsive: true,
      paging: true,
      scrollX: true,
      scrollY: '300px',
      scrollCollapse: false,
      pageLength: 10,
      // lengthChange: false,
      columnDefs: [{ orderable: false, searchable: false, targets: [0] }],
      // order: [[1, 'asc']],
      serverSide: true,
      processing: true,
      retrieve: true,
      columns: [
        // { data: 'sr-number' },
        { data: 'row-id' },
        { data: 'username' },
        { data: 'phone_number' },
        { data: 'email' },
        { data: 'role' },
        { data: 'is_active' },
        { data: 'Action' },
      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.getUsersList(dataTablesParameters, callback);
      },
    };

    this.createForm()
    if (!this.userForm.image) {
      this.profileImage = '/assets/img/def-user-db.png'
    }
  }

  reInitDataTable(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.ajax.reload();
      });
    } catch (err) { }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next('');
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      ROWID: '',
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      phone_number: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      // company_name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['1', [Validators.required, Validators.minLength(1)]],
      address: ['', [Validators.required, Validators.minLength(8)]],
      // created_at: ['', [Validators.required]],
      // updated_at: ['', [Validators.required]],
      // status: ['', [Validators.required]],
    });
  }

  get myForm() {
    return this.userForm.controls;
  }

  protected get registerFormControl() {
    return this.userForm.controls;
  }

  getUsersList(dataTablesParameters?: any, callback?: any) {
    let DTParm = JSON.parse(JSON.stringify(dataTablesParameters))
    let pageConfig = {
      limit: DTParm.length,
      offset: DTParm.start,
      searchParam: ""
    }
    this.usersService.getUsersList(pageConfig).subscribe({
      next: (dataRes: any) => {
        if (dataRes.status == 200) {
          const userListData = dataRes.data;
          console.log('userList---DATA to show', this.userList);
          // this.spinner.hide();
          this.customStart = dataTablesParameters.start + 1;
          this.userList = userListData;
          callback({
            recordsTotal: dataRes.totalRecord,
            recordsFiltered: dataRes.totalRecord,
            // recordsFiltered: userListData.recordsFiltered,
            data: [],
          });
        }
      },
      error: (error: any) => {
        this.spinner.hide()
        this.toastr.error(error.message, 'Error!');
      }
    })
  }

  showUserModal(user ?:any) {
    this.createForm();
    if(user) {
      user.password = '';
      this.userForm.value = this.userForm.reset(user);
    } else {
      console.log('View User details', this.currentUser);
    }
    this.addUserModal.show();
  }

  userImage(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(this.currentFile);
      }
    }
    if (this.userForm.value.image) {
      this.userForm.value.previous_image = this.userForm.value.image;
    }
    this.userForm.value.image =event.target.files[0];
  }

  changeUserStatus(user: any) {
    let postData = {
      ROWID: user.ROWID,
      is_active: user.is_active ? false: true,
    };
    // HERE WE CAN CALL API FOR SAVING DATA
    this.usersService.saveUserInfo(postData).subscribe(
      {
        next:(dataRes: any) => {
          if (dataRes.status === 200) {
            dataRes = dataRes.data;
            this.globalService.sendActionChildToParent('stop');
            this.toastr.success(
              'User status has been changed successfully.',
              'Success!'
            );
            let index = this.userList.findIndex((x) => x._id === dataRes._id);
            if (index) {
              this.userList[index].status = dataRes.status;
              this.reInitDataTable();
            }
          }
        },
        error: (error: any) => {
          this.globalService.sendActionChildToParent('stop');
          this.toastr.error(error.message, 'Error!');
        }
      }
    );
  }

  addUser() {
    let userinfo: any = Object.assign({}, this.userForm.value);
    this.spinner.show()
    var formData = new FormData();
    Object.keys(userinfo).map((key)=>{
      console.log('key================', userinfo[key]);
      formData.append(key, userinfo[key]);
    })

    this.usersService.saveUserInfoWithphoto(formData).subscribe({
      next: (dataRes: any) => {
        this.spinner.hide()
        if (dataRes.status === 200) {
          this.closeModel();
          this.reInitDataTable();
          this.toastr.success(dataRes.message, 'Success!');
          dataRes = dataRes.data;
        } else {
          this.toastr.success('there are some error while adding users '+ dataRes.data, 'Success!');
        }
      },
      error: (error: any) => {
        this.spinner.hide()
        this.toastr.error(error.message, 'Error!');
      }
    });
  }

  showUserInfoModal(user: any) {
    this.currentUser = user;
    console.log('View User details', this.currentUser);
    this.userInfoModal.show();
  }


  showDeleteUserModal(user: any) {
    this.currentUser = user;
    this.deleteUserModal.show();
  }

  deleteUser() {
    this.spinner.show();
    this.usersService.deleteUser(this.currentUser).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        this.deleteUserModal.hide();
        if (data.status === 200) {
          this.reInitDataTable();
          const found = this.userList.filter((obj: any) => {
            return obj.id === this.currentUser.id;
          });
          if (found.length) {
            const index = this.userList.indexOf(found[0]);
            this.userList.splice(index, 1);
          }
          this.toastr.success("Record Deleted successfully. ", "Success");
        } else {
          this.toastr.error(
            "There are some error. Please check connection."+ data.data,
            "Error"
          );
        }
        this.currentUser = {};
      },
      error: (error: any) => {
        this.spinner.hide();
        this.deleteUserModal.hide();
        this.toastr.error(
          "There are some server error. Please check connection.",
          "Error"
        );
      }
    });
  }

  closeModel() {
    this.addUserModal.hide();
    this.deleteUserModal.hide();
  }

}
