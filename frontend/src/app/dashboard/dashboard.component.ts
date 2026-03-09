import { Component } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,  // ✅ Make it standalone
  imports: [CommonModule],  // ✅ Import CommonModule for *ngFor
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router) {}
  lessons = [
    { urdu: "حروفِ تہجی", english: "alphabets" },
    { urdu: "الفاظ", english: "Words" },
    { urdu: "املا", english: "Spelling" },
    { urdu: "افعال", english: "Verbs" },
    { urdu: "جملے", english: "Sentences" },
    { urdu: "محاورے", english: "Idioms" },
    { urdu: "گرامر", english: "Grammar" },
    { urdu: "مطالعہ", english: "Reading" },
    { urdu: "مکالمہ", english: "Conversation" },
    { urdu: "تحریر", english: "Writing" }
  ];

  materials = [
    "PDF Notes",
    "Vocabulary Sheets",
    "Practice Worksheets",
    "Extra Reading Material",
    "Audio Lessons"
  ];

  // Add click handlers
  openLesson(lesson: any, index: number) {
    console.log('Opening lesson:', lesson, 'at index:', index);
    this.router.navigateByUrl(`/${this.lessons[index].english}`);
  }

  viewMaterial(material: string) {
    console.log('Viewing material:', material);
    // TODO: Open material
  }
}