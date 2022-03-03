import {Component, ComponentFactoryResolver, Injector, OnInit} from '@angular/core';
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers/dist/js/leaflet.extra-markers.js";
import {PreviewComponent} from "../preview/preview.component";
import {MapService} from "../../../services/map.service";
import {Station} from "../../../classes/common/map";
import {State} from "../../../classes/shop/state";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector,
              private mapService: MapService) {
  }

  optionsSpec: any = {
    layers: [{url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: 'Open Street Map'}],
    zoom: 12,
    center: [50.272, 18.523]
  };

  zoom = this.optionsSpec.zoom;
  center = L.latLng(this.optionsSpec.center);
  formZoom = this.zoom;
  lat = this.center.lat;
  lng = this.center.lng;
  options = {
    layers: [L.tileLayer(this.optionsSpec.layers[0].url, {attribution: this.optionsSpec.layers[0].attribution})],
    zoom: this.optionsSpec.zoom,
    center: L.latLng(this.optionsSpec.center)
  };

  markers: L.Marker[] = [];
  myPoint: Station[];
  addMarker() {
    this.mapService.findAll().subscribe(
      data => {
        this.myPoint = data;
        for (const station of this.myPoint) {
          const redMarker = (L as any).ExtraMarkers.icon({
            icon: "fa-coffee",
            markerColor: "blue",
            shape: "square",
            prefix: "fa fa-4x",
            iconColor: "red"
          });
          // tslint:disable-next-line:radix
          const newMarker = L.marker([+station.gegrLat, +station.gegrLon],{icon: redMarker});
          newMarker.bindPopup(() => this.createCustomPopup(station)).openPopup();
          this.markers.push(newMarker);
        }
      },
      err => {
        console.log(JSON.stringify(err));
      }
    );

  }

  removeMarker() {
    this.markers.pop();
  }

  onCenterChange(center: L.LatLng) {
    setTimeout(() => {
      this.lat = center.lat;
      this.lng = center.lng;
    });
  }

  onZoomChange(zoom: number) {
    setTimeout(() => {
      this.formZoom = zoom;
    });
  }

  doApply() {
    this.center = L.latLng(this.lat, this.lng);
    this.zoom = this.formZoom;
  }

  private createCustomPopup(station: Station) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PreviewComponent);
    const component = factory.create(this.injector);

    component.instance.test = station.city.name + ' ' + station.addressStreet;
    component.changeDetectorRef.detectChanges();
    return component.location.nativeElement;
  }

}
