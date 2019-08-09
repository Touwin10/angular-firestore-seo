import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'firebase/firestore';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  colRef: AngularFirestoreCollection;
  tasks: Observable<any>;
  COL_NAME: string = "tasks";
  description: string;

  constructor(private db: AngularFirestore) {
    this.colRef = this.db.collection(this.COL_NAME);

  }

  ngOnInit() {
    this.tasks = this.db.collection(this.COL_NAME).snapshotChanges()
      .pipe(
        map(acs => {
          return acs.map((docChange: DocumentChangeAction<any>) => {
            const data = docChange.payload.doc.data();
            const id = docChange.payload.doc.id;
            return { id, ...data };
          })
        })

      );
  }

  addTask(desc: string) {
    this.colRef.add({
      description: desc
    }).then(_ => {
      this.description = "";
    });
  }

}

