import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CvService, CV } from '../../services/cv';
@Component({
  selector: 'app-cv-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cv-form.html',
  styleUrl: './cv-form.css'
})
export class CvForm implements OnInit {
  cvForm!: FormGroup;
  editingId: number | null = null;
  constructor(private fb: FormBuilder, private cvService: CvService, private route: ActivatedRoute,
    private router: Router) { }


  ngOnInit(): void {
    this.cvForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],

      personalInformation: this.fb.group({
        id: [null],
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        cityName: [''],
        mobileNumber: ['', [Validators.required,Validators.pattern('^[0-9]*$')]]
      }),

      experienceInformation: this.fb.group({
        id: [null],
        companyName: ['', [Validators.required, Validators.maxLength(20)]],
        companyField: ['',Validators.pattern('')],
        city: ['']
      })
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editingId = +id;
        this.cvService.getCV(+id).subscribe({
          next: (cv: CV) => {
            this.cvForm.patchValue(cv);
          },
          error: (err) => console.error('Error loading CV:', err)
        });
      }
    });

  }


  onSubmit() {
    if (!this.cvForm.valid) {
      alert('Form is invalid!');
      return;
    }

    console.log(this.cvForm.value);
    const cvData = this.cvForm.value;
    console.log('Submitting CV:', cvData);

    if (this.editingId) {
      this.cvService.putCV(this.editingId, cvData).subscribe({
        next: () => {
          alert('CV updated successfully!');
          this.router.navigate(['/']);
        },
        error: err => console.error('Error updating CV:', err)
      });
    }
    else {
      //this is needed to avoid null id error in POST payload
      delete cvData.id;
      delete cvData.personalInformation.id;
      delete cvData.experienceInformation.id;

      this.cvService.postCV(cvData).subscribe({
        next: (response) => {
          this.cvForm.reset();
          alert('CV created successfully!');
        },
        error: (err) => console.error('Error Posting CV:', err)
      });
    }
  }
}
