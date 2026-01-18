import {Injectable} from '@angular/core';
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
import {ICard, ITimeSlot, IUser} from '../interfaces/interfaces';

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
        console.error("Passwort existiert nicht in Firestore");
        return {data: undefined, ref: ref};
      }

      return {data: snap.data() as unknown as T, ref: ref};
    } catch (error) {
      console.error('Fehler beim Abrufen des Passworts:', error);
      return {data: undefined, ref: undefined};
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'allUsers'));
      return querySnapshot.docs.map(doc => doc.data() as IUser);
    } catch (error) {
      console.error('Fehler beim Abrufen der Users:', error);
      return [];
    }
  }

  async getAllCards(): Promise<ICard[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'cards'));
      return querySnapshot.docs.map(doc => doc.data() as ICard);
    } catch (error) {
      console.error('Fehler beim Abrufen der Karten:', error);
      return [];
    }
  }

  async createUser(user: IUser) {
    try {
      const userRef = doc(collection(this.firestore, 'allUsers'), user.id.toString());

      await setDoc(userRef, user);
      console.log(`User ${user.firstname} ${user.lastname} erfolgreich gespeichert.`);
    } catch (error) {
      console.error('Fehler beim Erstellen des Users:', error);
    }
  }

  async deleteUser(user: IUser) {
    try {
      const userRef = doc(collection(this.firestore, 'allUsers'), user.id.toString());

      await deleteDoc(userRef);
      await this.deleteUsersFromCards(user);
      console.log(`User ${user.firstname} ${user.lastname} erfolgreich gelöscht.`);
    } catch (error) {
      console.error('Fehler beim Löschen des Users:', error);
    }
  }

  private async deleteUsersFromCards(user: IUser){
    try {
      const allCards = await this.getAllCards();

      for(const card of allCards){
        for(const ts of card.timeSlots){
          if(ts.userIDs.some(id => id === user.id)){
            await this.removeUser(card, ts, user);
          }
        }
      }

    } catch (error){
      console.log(`Fehler beim Löschen des User ${user.firstname} aus den Karten`, error);
    }
  }

  async addCard(card: ICard){
    try {
      const cardRef = doc(collection(this.firestore, 'cards'), card.id.toString());

      await setDoc(cardRef, card);

      console.log(`Karte ${card.title} wurde erfolgreich erstellt.`);
    } catch (error) {
      console.error('Fehler beim Erstellen der Karte:', error);
    }
  }

  async renameCard(card: ICard){
    try {
      const cardRef = doc(this.firestore, 'cards', card.id.toString());
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        console.error("Karte existiert nicht in Firestore");
        return;
      }

      await updateDoc(cardRef, { title: card.title });
      console.log(`Karte ${card.title} wurde erfolgreich umbenannt.`);
    } catch (error){
      console.error('Fehler beim Umbennen der Karte:', error);
    }
  }

  async deleteCard(card: ICard){
    try {
      const cardRef = doc(collection(this.firestore, 'cards'), card.id.toString());

      await deleteDoc(cardRef);
      console.log(`Karte ${card.title} erfolgreich gelöscht.`);
    } catch (error) {
      console.error('Fehler beim Löschen der Karte:', error);
    }
  }

  async addTimeslot(card: ICard, timeslot: ITimeSlot){
    try {
      const cardData: FirebaseData<ICard> = await this.getData('cards', card.id.toString());

      if(cardData.data){
        const updatedTimeSlots = [...cardData.data.timeSlots, timeslot];

        await updateDoc(cardData.ref, { timeSlots: updatedTimeSlots });
        console.log(`Erflogreich Timeslot ${timeslot.time} erstellt.`);
      } else {
        console.log(`Timeslot ${timeslot.time} nicht gefunden.`);
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Timeslots:', error);
    }
  }

  async renameTimeslot(card: ICard, timeslot: ITimeSlot){
    try {
      const cardData: FirebaseData<ICard> = await this.getData('cards', card.id.toString());

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
        console.log(`Erflogreich Timeslot ${timeslot.time} umbenannt.`);
      } else {
        console.log(`Timeslot ${timeslot.time} nicht gefunden.`);
      }
    } catch (error) {
      console.error('Fehler beim Umbennen des Timeslots:', error);
    }
  }

  async deleteTimeslot(card: ICard, timeslot: ITimeSlot){
    try {
      const cardData: FirebaseData<ICard> = await this.getData('cards', card.id.toString());

      if(cardData.data){
        const updatedTimeSlots = cardData.data.timeSlots.filter(ts => ts.id !== timeslot.id);

        await updateDoc(cardData.ref, { timeSlots: updatedTimeSlots });
        console.log(`Erflogreich Timeslot ${timeslot.time} gelöscht.`);
      } else {
        console.log(`Timeslot ${timeslot.time} nicht gefunden.`);
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Timeslots:', error);
    }
  }

  async addUser(card: ICard, timeslot: ITimeSlot, user: IUser){
    try {
      const cardData: FirebaseData<ICard> = await this.getData('cards', card.id.toString());

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
        console.log(`User ${user.firstname} erfolgreich hinzugefügt.`);
      } else {
        console.log(`User ${user.firstname} wurde nicht gefunden.`);
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Users:', error);
    }
  }

  async removeUser(card: ICard, timeslot: ITimeSlot, user: IUser){
    try {
      const cardData: FirebaseData<ICard> = await this.getData<ICard>('cards', card.id.toString());

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

        console.log(`User ${user.firstname} erfolgreich gelöscht.`);
      } else {
        console.log(`User ${user.firstname} wurde nicht gefunden.`)
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Users:', error);
    }
  }

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
