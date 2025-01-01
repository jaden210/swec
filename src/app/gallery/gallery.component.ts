import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Title, Meta } from '@angular/platform-browser';
import { Gallery } from "../admin/admin.service";
import { AppService } from "../app.service";

@Component({
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"]
})
export class GalleryComponent {

  gallery: Gallery[] = [];

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private _db: AngularFirestore,
    private _appService: AppService
    ) {
      this.titleService.setTitle("swec Spray Tans | Gallery");
      this.metaTagService.updateTag(
        { name: 'description', content: `
        swec Spray Tans gives you the perfect glow for any occasion! Check out all these satisfied customers tans and book your appointment today` }
      );

    }

    ngOnInit() {
      this._db.collection("gallery").valueChanges().subscribe(gallery => {
        this.gallery = gallery;
      })
    }

    public book() {
      this._appService.bookAppointment();
    }
}

