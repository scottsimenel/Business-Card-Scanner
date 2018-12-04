import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private camera: Camera,
    public http: HttpClient
  ) {}

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  takePicture() {
    this.camera.getPicture(this.options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = "data:image/jpeg;base64," + imageData;
        console.log(base64Image);
        let imageText = this.analyzeImage(base64Image);
        this.showSaveAlert(imageText);
      },
      err => {
        // Handle error
      }
    );
  }

  analyzeImage(base64String) {
    let req = {
      language: "eng",
      isOverlayRequired: false,
      base64Image: base64String,
      iscreatesearchablepdf: false,
      issearchablepdfhidetextlayer: false
    };

    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        apikey: "9b23b66b7288957"
      })
    };

    return this.http.post(
      "https://api.ocr.space/parse/image",
      req,
      httpOptions,
      function(err, res) {}
    );
  }

  btnClicked() {
    let confirm = this.alertCtrl.create({
      title: "Open Camera?",
      message: "Allow the Camera to be opened?",
      buttons: [
        {
          text: "Disagree",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Agree",
          handler: () => {
            this.takePicture();
            console.log("Agree clicked");
          }
        }
      ]
    });
    confirm.present();
  }

  showSaveAlert(contactInfo) {
    let confirm = this.alertCtrl.create({
      title: "Save Contact?",
      message: contactInfo.ParsedResults.Parsedtext,
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("No clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            this.saveContact(contactInfo);
            console.log("Yes clicked");
          }
        }
      ]
    });
    confirm.present();
  }

  saveContact(contactInfo) {}
}
