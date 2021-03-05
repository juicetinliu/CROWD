import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

interface Location {
  value: string;
  people: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  title = 'CROWD';
  selectedLocation: Location;
  selectedLocationID: number;

  tempcrowdedness: number = 0;
  timeStart; timeEnd;
  data: Location[];

  dbRef: AngularFireList<any>;
  @ViewChild('locSelection') locSelection;

  constructor(private db: AngularFireDatabase){
  }

  ngOnInit() {
    this.data = [
      {value: "", people: 0}
    ];
    this.selectedLocation = this.data[0];
    this.selectedLocationID = 0;
    this.tempcrowdedness = this.selectedLocation.people;
    this.dbRef = this.db.list("Locations");
    this.dbRef.valueChanges().subscribe((data) => {
      this.data = data;
      this.locSelection.value = this.data[this.selectedLocationID];
      this.selectedLocation = this.locSelection.value;
      this.tempcrowdedness = this.selectedLocation.people;
    });
  }

  updateLocation(): void{
    this.selectedLocation = this.locSelection.value;
    this.selectedLocationID = this.data.findIndex(loc => loc.value == this.selectedLocation.value);
    this.tempcrowdedness = this.selectedLocation.people;
  }

  increaseCrowdAmount(): void{
    this.tempcrowdedness += 1;
  }

  decreaseCrowdAmount(): void{
    this.tempcrowdedness = Math.max(this.tempcrowdedness - 1, 0);
  }

  confirmCrowdAmount(): void{
    this.dbRef.update(String(this.selectedLocationID), { people: this.tempcrowdedness });
    // this.data[this.selectedLocationID].people = this.tempcrowdedness;
  }

  resetCrowdAmount(): void{
    this.tempcrowdedness = 0;
    // this.data[this.selectedLocationID].people = 0;
    this.dbRef.update(String(this.selectedLocationID), { people: this.tempcrowdedness });
  }
}
