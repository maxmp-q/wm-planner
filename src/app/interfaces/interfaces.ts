export interface CardDto {
  title: string;
  id: number;
  timeSlots : TimeSlotDto[];
}

export interface TimeSlotDto {
  time: string;
  id: number;
  userIDs: number[];
}

export interface UserDto {
  firstname: string;
  lastname: string;
  id: number;
}

export interface HeadingDto{
  title: string;
}

export interface LoginDto{
  username: string;
  password: string;
}

export interface AuthResponseDto{
  token: string;
}


