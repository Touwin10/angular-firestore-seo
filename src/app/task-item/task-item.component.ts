import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import 'firebase/firestore';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  task: Observable<any>;
  colRef: AngularFirestoreCollection;
  COL_NAME: string = "tasks";

  constructor(private route: ActivatedRoute,
    private db: AngularFirestore,
    private title: Title,
    private meta: Meta) {
    this.colRef = this.db.collection(this.COL_NAME);
  }

  async ngOnInit() {
    const params = await new Promise(resolve => { this.route.params.subscribe(p => resolve(p)) });
    const id = params['id'];

    if (id && this.db)
      this.task = this.colRef.doc(id).valueChanges();
    this.task.subscribe(data => {
      if (!data)
        return;
      this.title.setTitle(data.description);
      this.meta.updateTag({ name: 'description', content: data.description });
    })

  }

}
