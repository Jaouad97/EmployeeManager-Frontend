import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employeemanagerapp';
  public employees: Employee[]=[];
  
  public editEmployee!: Employee;
  public deleteEmployee!: Employee;

  constructor(private employeeService: EmployeeService) {}
  public isDataLoaded: boolean = false;

  ngOnInit() {
    this.getEmployees();
  }


  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
        this.isDataLoaded = true;
        console.log(this.employees);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }


  public onAddEmployee(addForm: NgForm): void {
    const addEmployeeForm = document.getElementById('add-employee-form');
    if (addEmployeeForm) {
      addEmployeeForm.click();
    }
  
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    });
  }
  

  public onUpdateEmployee(employee: Employee | null): void {
  if (employee !== null) {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
}


public onDeleteEmployee(employeeId: number | null): void {
  if (employeeId !== null) {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
}


  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (
        employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit' && employee !== null) {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete' && employee !== null) {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    if (container) {
      container.appendChild(button);
      button.click();
    }
  }
}

