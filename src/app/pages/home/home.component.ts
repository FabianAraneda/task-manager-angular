import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnEnum } from 'src/app/core/enum/table.enum';
import { TaskService } from 'src/app/core/service/task.service';
import { ITask } from 'src/app/interface/task.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}