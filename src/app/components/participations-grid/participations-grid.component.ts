import { Component, OnInit, Input } from '@angular/core';
import { Participation } from '../../state/contest.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'cc-participations-grid',
  templateUrl: './participations-grid.component.html',
  styleUrls: ['./participations-grid.component.css']
})
export class ParticipationsGridComponent implements OnInit {

  @Input('participations') participations: Participation[];

  constructor() { }

  ngOnInit() {
  }

}