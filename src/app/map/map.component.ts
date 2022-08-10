import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

import { Project } from '../project';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {

  @Input() projects: Project[] = [];

  infoContent: string = "";

  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow|undefined;

  apiLoaded: Observable<boolean>;

  options: google.maps.MapOptions = {
    center: {lat: 30.267222, lng: -97.743056},
    zoom: 11
  };
  markers: MapMarker[] = [];

  constructor(private httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyCmbB-RVBBSRcsjQBwKem-oetPnO_AS0w8', 'callback')
    .pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  ngOnInit(): void {
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateMarkers();
  }

  openInfo(marker: MapMarker, content: string) {
    // this.infoContent = content;
    this.infoContent = content;
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

  updateMarkers(){
    this.markers = []
    this.projects.forEach(project => {
      this.addMarker(project.latitude, project.longitude, project.project_name);
    });
  }

  addMarker(latitude: number, longitude: number, projectName: string) {
    if (!isNaN(latitude)&& !isNaN(longitude)){
      this.markers.push({
        position: {
          lat: +latitude, 
          lng: +longitude,
        },
        title: projectName
      } as MapMarker);
    }
  }
}
