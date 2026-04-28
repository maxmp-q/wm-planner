import {inject, Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import {CardDto, TimeSlotDto, UserDto} from '../interfaces/interfaces';
import {ToasterState} from '../store/toaster';

const firebaseConfig = {
  apiKey: "AIzaSyCYCxnkC8-LftaF-cn-zzZ3W62ZZwELpR8",
  authDomain: "wm-planner.firebaseapp.com",
  projectId: "wm-planner",
};

const app = initializeApp(firebaseConfig);

interface FirebaseData<T>{
  data: T | undefined,
  ref: any
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  public firestore: Firestore = getFirestore(app);
  toaster = inject(ToasterState);

  /**
   * This function is used to get data from firebase. T is used to get the right
   * type back and while having the support of ts.
   *
   * @param collection is the collection name in firebase.
   * @param id is the id in the collection
   * @private
   */
  private async getData<T>(
    collection: string,
    id: string
  ): Promise<FirebaseData<T>>{
    try {
      const ref = doc(this.firestore, collection, id);
      const snap= await getDoc(ref);

      if (!snap.exists()) {
        console.error("Daten existiert nicht in Firestore");
        return {data: undefined, ref: ref};
      }

      return {data: snap.data() as unknown as T, ref: ref};
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
      return {data: undefined, ref: undefined};
    }
  }

  // Timeslot Shit
  async addTimeslot(card: CardDto, timeslot: TimeSlotDto){
    try {
      const cardData: FirebaseData<CardDto> = await this.getData('cards', card.id.toString());

      if(cardData.data){
        const updatedTimeSlots = [...cardData.data.timeSlots, timeslot];

        await updateDoc(cardData.ref, { timeSlots: updatedTimeSlots });
        this.toaster.show(`Timeslot ${timeslot.time} erfolgreich erstellt.`);
      } else {
        this.toaster.show(`Timeslot ${timeslot.time} nicht gefunden.`);
      }
    } catch (error) {
      this.toaster.show('Fehler beim Erstellen des Timeslots.');
      console.error('Fehler beim Erstellen des Timeslots:', error);
    }
  }

  async renameTimeslot(card: CardDto, timeslot: TimeSlotDto){
    try {
      const cardData: FirebaseData<CardDto> = await this.getData('cards', card.id.toString());

      if(cardData.data){
        const updatedTimeSlots = cardData.data.timeSlots.map(ts => {
          if (ts.id === timeslot.id) {
            return {
              ...ts,
              time: timeslot.time
            };
          }
          return ts;
        });

        await updateDoc(cardData.ref, { timeSlots: updatedTimeSlots });
        this.toaster.show(`Timeslot ${timeslot.time} erfolgreich umbenannt.`);
      } else {
        this.toaster.show(`Timeslot ${timeslot.time} nicht gefunden.`);
      }
    } catch (error) {
      this.toaster.show('Fehler beim Umbennen des Timeslots.');
      console.error('Fehler beim Umbennen des Timeslots:', error);
    }
  }

  async deleteTimeslot(card: CardDto, timeslot: TimeSlotDto){
    try {
      const cardData: FirebaseData<CardDto> = await this.getData('cards', card.id.toString());

      if(cardData.data){
        const updatedTimeSlots = cardData.data.timeSlots.filter(ts => ts.id !== timeslot.id);

        await updateDoc(cardData.ref, { timeSlots: updatedTimeSlots });
        this.toaster.show(`Timeslot ${timeslot.time} erfolgreich gelöscht.`);
      } else {
        this.toaster.show(`Timeslot ${timeslot.time} nicht gefunden.`);
      }
    } catch (error) {
      this.toaster.show('Fehler beim Löschen des Timeslots.');
      console.error('Fehler beim Löschen des Timeslots:', error);
    }
  }

  async addUser(card: CardDto, timeslot: TimeSlotDto, user: UserDto){
    try {
      const cardData: FirebaseData<CardDto> = await this.getData('cards', card.id.toString());

      if(cardData.data){
        const updatedTimeSlots = cardData.data.timeSlots.map(ts => {
          if (ts.id === timeslot.id) {
            return {
              ...ts,
              userIDs: ts.userIDs ? [...ts.userIDs, user.id] : [user.id]
            };
          }
          return ts;
        });

        await updateDoc(cardData.ref, { timeSlots: updatedTimeSlots });
        this.toaster.show(`User ${user.firstname} erfolgreich hinzugefügt.`);
      } else {
        this.toaster.show(`User ${user.firstname} wurde nicht gefunden.`);
      }
    } catch (error) {
      this.toaster.show('Fehler beim Erstellen des Users.');
      console.error('Fehler beim Erstellen des Users:', error);
    }
  }

  async removeUser(card: CardDto, timeslot: TimeSlotDto, user: UserDto){
    try {
      const cardData: FirebaseData<CardDto> = await this.getData<CardDto>('cards', card.id.toString());

      if(cardData.data){
        const updatedTimeSlots = cardData.data.timeSlots.map(ts => {
          if (ts.id === timeslot.id) {
            return {
              ...ts,
              userIDs: ts.userIDs.filter( id => id !== user.id)
            };
          }
          return ts;
        });

        await updateDoc(cardData.ref, { timeSlots: updatedTimeSlots });

        this.toaster.show(`User ${user.firstname} erfolgreich entfernt.`);
      } else {
        this.toaster.show(`User ${user.firstname} wurde nicht gefunden.`)
      }
    } catch (error) {
      this.toaster.show('Fehler beim Entfernen des Users.');
      console.error('Fehler beim Entfernen des Users:', error);
    }
  }

  // Other shit
  async getHeading(): Promise<string> {
    try {
      const headingData: FirebaseData<Record<string, string>> = await this.getData<Record<string, string>>('heading', '1');
      return headingData.data ? headingData.data["heading"] : '';
    } catch (error) {
      console.error('Fehler beim Abrufen des Headers:', error);
      return '';
    }
  }

  async getPasswortHash(): Promise<string> {
    try {
      const passwortData: FirebaseData<Record<string, string>> = await this.getData<Record<string, string>>('passwort', '1');
      return passwortData.data ? passwortData.data["passwort"] : 'error';
    } catch (error) {
      console.error('Fehler beim Abrufen des Passworts:', error);
      return 'error';
    }
  }
}
