export interface CareerDTO {
  carSeq?: string | null;
  seq?: string | null;
  compName?: string | null;
  location?: string | null;
  startPeriod?: string | null;
  endPeriod?: string | null;
  task?: string | null;
  checked?: boolean;
}

export interface CertificateDTO {
  certSeq?: string | null;
  seq?: string | null;
  qualifiName?: string | null;
  acquDate?: string | null;
  organizeName?: string | null;
  checked?: boolean;
}

export interface EducationDTO {
  eduSeq?: string | null;
  seq?: string | null;
  schoolName?: string | null;
  division?: string | null;
  startPeriod?: string | null;
  endPeriod?: string | null;
  major?: string | null;
  grade?: string | null;
  location?: string | null;
  checked?: boolean;
}

export interface RecruitDTO {
  seq: string;
  name: string;
  birth?: string | null;
  phone: string;
  email?: string | null;
  addr?: string | null;
  location?: string | null;
  workType?: string | null;
  submitFlag?: boolean;
  gender?: string | null;
  educations?: EducationDTO[];
  careers?: CareerDTO[];
  certificates?: CertificateDTO[];
}

export interface SummaryDTO {
  eduYear?: string | null;
  eduType?: string | null;
  carYear?: string | null;
  carMonth?: string | null;
  preferRegion?: string | null;
  contractType?: string | null;
}
