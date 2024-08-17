export interface FundersComponentProps {
  funders: Funder[];
}

export interface Funder {
  id: string;
  instrument: string;
  website: string;
  icon: string;
  iconDark: string;
  projectTitle: string;
  recipients: Recipient[];
  timeline: {
    start: string;
    end: string;
    time_zone: any;
  };
}

export interface Recipient {
  id: string;
  name: string;
  color: string;
}
