export interface ICard {
  title: string;
  timeSlots : ITimeSlot[];
}

export interface ITimeSlot{
  time: string;
  users: IUser[];
}

export interface IUser{
  firstname: string;
  lastname: string;
  id: number;
}


