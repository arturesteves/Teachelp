import * as firebase from "firebase";
var Subject = require("./Subject");
var Teacher = require("./Teacher");

let namespaces = require("./namespaces").namespaces;

// TODO: suportar o número da aula
// TODO: substituir teacher e subject por teacherId and subjectId -> ATENÇÃO: que esta alteração requer que talvez seja necessário alterar os testes
class Lesson{
    constructor(teacher, subject, startDate, endDate, photo){
        this.teacher = teacher;
        this.subject = subject;
        this.startDate = startDate;
        this.endDate = endDate;
        this.photo = photo || "No Photo";
    }

    save(){
        if(this.id){
            return firebase.database().ref(namespaces.lessons + this.id).update({
                teacher: this.teacher,
                subject: this.subject,
                startDate: this.startDate,
                endDate: this.endDate,
                photo: this.photo,
            });
        } else {
            return new Promise((resolve, reject)=>{
                // aqui seria necessario ver quantas aulas existem para esta disciplina (count)
                let obj = firebase.database().ref(namespaces.lessons).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(namespaces.lessons + this.id).remove();
    }

    async getSubject(){
        return await Subject.retrieve(this.subject);
    }

    async getTeacher(){
        return await Teacher.retrieve(this.teacher);
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.lessons + id).once('value').then(function(snapshot){
                let teacher = snapshot.val().teacher;
                let subject = snapshot.val().subject;
                let startDate = snapshot.val().startDate;
                let endDate = snapshot.val().endDate;
                let photo = snapshot.val().photo;
                let lesson = new Lesson(teacher, subject, startDate, endDate, photo);
                lesson.id = id;
                resolve(lesson);
            });
        });
    }
}

module.exports = Lesson;
