import { Component } from "@angular/core";
import { Title, Meta } from '@angular/platform-browser';

@Component({
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent {

  constructor(
    private titleService: Title,
    private metaTagService: Meta
    ) {
      this.titleService.setTitle("Audiobiography - About Us");
      this.metaTagService.updateTag(
        { name: 'description', content: `
        We’re moms, dads, and friends who have a real interest in audio. We
        followed our hearts to create an all-new product to make capturing and
        preserving life history easier, and to do it in the most beautiful
        medium in the world: audio. We ran a Kickstarter campaign which was
        successfully funded and here we are today, shipping Audiobiography all
        over the world.` }
      );

    }

    ngOnInit() {
  
    }


}

