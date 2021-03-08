import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

interface Location {
  value: string;
  total: number;
  people: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  selectedLocation: Location;
  selectedLocationID: number;

  tempcrowdedness: number = 0;
  tempmaxamount: number = 0;
  data;

  dbRef: AngularFireList<any>;
  @ViewChild('locSelection') locSelection;

  constructor(private db: AngularFireDatabase){
  }

  ngOnInit() {
    this.data = [
      {value: "", people: 0, total: 0}
    ];
    this.selectedLocation = this.data[0];
    this.selectedLocationID = 0;
    this.tempcrowdedness = this.selectedLocation.people;
    this.tempmaxamount = this.selectedLocation.total;
    this.dbRef = this.db.list("Locations");
    this.dbRef.valueChanges().subscribe((data) => {
      this.data = data;
      console.log(this.data);
      this.locSelection.value = this.data[this.selectedLocationID];
      this.selectedLocation = this.locSelection.value;
      this.tempcrowdedness = this.selectedLocation.people;
      this.tempmaxamount = this.selectedLocation.total;
    });
  }

  updateLocation(): void{
    this.selectedLocation = this.locSelection.value;
    this.selectedLocationID = this.data.findIndex(loc => loc.value == this.selectedLocation.value);
    this.tempcrowdedness = this.selectedLocation.people;
    this.tempmaxamount = this.selectedLocation.total;
  }

  increaseCrowdAmount(): void{
    this.tempcrowdedness = Math.min(this.tempcrowdedness + 1, this.selectedLocation.total);
  }

  decreaseCrowdAmount(): void{
    this.tempcrowdedness = Math.max(this.tempcrowdedness - 1, 0);
  }

  confirmCrowdAmount(): void{
    this.dbRef.update(String(this.selectedLocationID), { people: this.tempcrowdedness });
    // this.data[this.selectedLocationID].people = this.tempcrowdedness;
  }

  resetCrowdAmount(): void{
    if (this.tempcrowdedness == this.selectedLocation.people){
      this.tempcrowdedness = 0;
      // this.data[this.selectedLocationID].people = 0;
      this.dbRef.update(String(this.selectedLocationID), { people: this.tempcrowdedness });
    }else{
      this.tempcrowdedness = this.selectedLocation.people;
    }
  }

  increaseMaxAmount(): void{
    this.tempmaxamount += 1;
  }

  decreaseMaxAmount(): void{
    this.tempmaxamount = Math.max(this.tempmaxamount - 1, this.selectedLocation.people);
  }

  confirmMaxAmount(): void{
    this.dbRef.update(String(this.selectedLocationID), { total: this.tempmaxamount });
    // this.data[this.selectedLocationID].people = this.tempcrowdedness;
  }
}
