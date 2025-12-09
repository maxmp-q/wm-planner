export interface ICard {
  title: string;
  id: number;
  timeSlots : ITimeSlot[];
}

export interface ITimeSlot{
  time: string;
  id: number;
  users: IUser[];
}

export interface IUser{
  firstname: string;
  lastname: string;
  id: number;
}


