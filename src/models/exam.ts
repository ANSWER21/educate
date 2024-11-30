export interface Exam {
    id: number | null,
    title: string,
    college: string,
    subject: string,
    date: Date,
    createId: number,
    files: string[],
}

export interface College {
    code: string,
    name: string,
    department: string | null,
    location: string | null,
    level: string | null,
    remark: string | null
}

export interface Subject {
    code: string,
    name: string,
    collegeCode: string,
}

export const getSubjectTip = (subjects: Subject[], value: string): string => {
    const subject = findSubjectByValue(subjects, value)
    return `(${subject?.code})${subject?.name}`
}

export function findSubjectByValue(subjects: Subject[], code: string): Subject | undefined {
    return subjects.find(subject => subject.code === code);
}







