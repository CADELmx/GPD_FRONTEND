import { EducationalProgram } from "./educational-program";

export type Area = {
    id: number;
    name: string;
    educationalPrograms?: EducationalProgram[];
}