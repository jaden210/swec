import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { AppointmentSheetComponent } from "./appointment/appointment-sheet.component";
import { Appointment } from "./appointment/appointment-sheet.service";

@Injectable({
  providedIn: "root",
})
export class AppService {
  public demoModeSuppressed: boolean;

  constructor(private _db: AngularFirestore, private _bottomSheet: MatBottomSheet) {}


  public bookAppointment(isAdmin: boolean = false) {
    this._bottomSheet.open(AppointmentSheetComponent, {
      disableClose: true,
      data: {isAdmin}
    });
  }

  public getAppointment(id): Observable<Appointment> {
    return this._db.doc<Appointment>(`appointments/${id}`).valueChanges();
  }

  public getAppointments(): Observable<Appointment[]> {
    return this._db.collection<Appointment>("appointments", ref => ref.orderBy("appointment", "asc")).valueChanges({ idField: "id" });
  }

  public getContacts(): Observable<Contact[]> {
    return this._db.collection<Contact>(`contacts`).valueChanges({idField: 'id'});
  }

  public checkMobile(): boolean {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
    return check;
  };

  public addToContactList(number: string, name: string = null, ig: string = null): Promise<any> {
    number = number ? number.trim().toLowerCase() : ig;
    let body: any = {
      number: number,
      createdAt: new Date()
    }
    if (name) body.name = name;
    return this._db.collection<any>("contacts").doc(number).set(body);
  }

  public resampleImage(
    image: any,
    fileType: string,
    maxDimensionPx: number
  ): Promise<{ blob: Blob; height: number; width: number }> {
    const widthSource: number = image.width;
    const heightSource: number = image.height;

    let width = image.width;
    let height = image.height;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);

    let scaleFactor;
    if (height > maxDimensionPx) {
      scaleFactor = maxDimensionPx / height;
      height = maxDimensionPx;
      width = width * scaleFactor;
    } else if (width > maxDimensionPx) {
      scaleFactor = maxDimensionPx / width;
      width = maxDimensionPx;
      height = height * scaleFactor;
    }

    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = widthSource / width;
    var ratio_h = heightSource / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    // var ctx = canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, widthSource, heightSource);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
      for (var i = 0; i < width; i++) {
        var x2 = (i + j * width) * 4;
        var weight = 0;
        var weights = 0;
        var weights_alpha = 0;
        var gx_r = 0;
        var gx_g = 0;
        var gx_b = 0;
        var gx_a = 0;
        var center_y = (j + 0.5) * ratio_h;
        var yy_start = Math.floor(j * ratio_h);
        var yy_stop = Math.ceil((j + 1) * ratio_h);
        for (var yy = yy_start; yy < yy_stop; yy++) {
          var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
          var center_x = (i + 0.5) * ratio_w;
          var w0 = dy * dy; //pre-calc part of w
          var xx_start = Math.floor(i * ratio_w);
          var xx_stop = Math.ceil((i + 1) * ratio_w);
          for (var xx = xx_start; xx < xx_stop; xx++) {
            var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
            var w = Math.sqrt(w0 + dx * dx);
            if (w >= 1) {
              //pixel too far
              continue;
            }
            //hermite filter
            weight = 2 * w * w * w - 3 * w * w + 1;
            var pos_x = 4 * (xx + yy * widthSource);
            //alpha
            gx_a += weight * data[pos_x + 3];
            weights_alpha += weight;
            //colors
            if (data[pos_x + 3] < 255)
              weight = (weight * data[pos_x + 3]) / 250;
            gx_r += weight * data[pos_x];
            gx_g += weight * data[pos_x + 1];
            gx_b += weight * data[pos_x + 2];
            weights += weight;
          }
        }
        data2[x2] = gx_r / weights;
        data2[x2 + 1] = gx_g / weights;
        data2[x2 + 2] = gx_b / weights;
        data2[x2 + 3] = gx_a / weights_alpha;
      }
    }

    canvas.width = width;
    canvas.height = height;

    //draw
    ctx.putImageData(img2, 0, 0);

    return new Promise((resolve) =>
      ctx.canvas.toBlob((blob) => {
        resolve({ blob, height, width });
      }, fileType)
    );
  }
}



export class Quote {
  id: string;
  customerName: string;
  createdAt: any = new Date();
  filterItems: string[] = [];
  itemId?: string;
  price?: number;
  completedAt: any;
  invoiceId: string;
}


export class Invoice {
  id: string;
  customerName: string;
  createdAt: any = new Date();
  items: any[] = [];
}

export class Contact {
  name: string;
  number: string;
  createdAt: any;
}