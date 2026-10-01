import { Component } from '@angular/core';
import { Profile } from '../profile/profile';
import { Experience } from '../experience/experience';
import { Education } from '../education/education';
import { Skill } from '../skill/skill';
import { Project } from '../project/project';
import { Certificate } from '../certificate/certificate';

type Tab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certificates';

@Component({
  selector: 'app-profile-hub',
  standalone: true,
  imports: [Profile, Experience, Education, Skill, Project, Certificate],
  templateUrl: './profile-hub.html',
  styleUrl: './profile-hub.css'
})
export class ProfileHub {
  tabs: { key: Tab; label: string }[] = [
    { key: 'personal', label: 'Personal' },
    { key: 'experience', label: 'Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'certificates', label: 'Certificates' }
  ];

  activeTab: Tab = 'personal';

  select(tab: Tab): void {
    this.activeTab = tab;
  }
}