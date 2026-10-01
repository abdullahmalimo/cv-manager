import { ExperienceInformation } from "./experience-informtion.model";
import { PersonalInformation } from "./personal-information.model";

export interface CV {
  id?: number;
  name: string;
  personalInformation: PersonalInformation;
  experienceInformation: ExperienceInformation;
}
