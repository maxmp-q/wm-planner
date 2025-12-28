import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import {ICard, IUser, ITimeSlot} from '../interfaces/interfaces';

const firebaseConfig = {
  apiKey: "AIzaSyCYCxnkC8-LftaF-cn-zzZ3W62ZZwELpR8",
  authDomain: "wm-planner.firebaseapp.com",
  projectId: "wm-planner",
};

const app = initializeApp(firebaseConfig);

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  public firestore: Firestore = getFirestore(app);

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
      // Referenz auf die "users"-Collection und Dokument mit user.id
      const userRef = doc(collection(this.firestore, 'allUsers'), user.id.toString());

      // Schreibe das User-Objekt in Firestore
      await setDoc(userRef, user);

      console.log(`User ${user.firstname} ${user.lastname} erfolgreich gespeichert.`);
    } catch (error) {
      console.error('Fehler beim Erstellen des Users:', error);
    }
  }

  async deleteUser(user: IUser) {
    try {
      // Referenz auf die "users"-Collection und Dokument mit user.id
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
      // Referenz auf die "users"-Collection und Dokument mit user.id
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
      // 1. Document-Referenz zur Karte
      const cardRef = doc(this.firestore, 'cards', card.id.toString());

      // 2. Karte aus Firestore laden
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        console.error("Karte existiert nicht in Firestore");
        return;
      }

      const cardData = cardSnap.data() as ICard;

      // 3. neuen Timeslot ins Array pushen
      const updatedTimeSlots = [...cardData.timeSlots, timeslot];

      // 4. Update speichern
      await updateDoc(cardRef, { timeSlots: updatedTimeSlots });

    } catch (error) {
      console.error('Fehler beim Erstellen des Timeslots:', error);
    }
  }

  async renameTimeslot(card: ICard, timeslot: ITimeSlot){
    try {
      const cardRef = doc(this.firestore, 'cards', card.id.toString());
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        console.error("Karte existiert nicht in Firestore");
        return;
      }

      const cardData = cardSnap.data() as ICard;

      // === Timeslot updaten ===
      const updatedTimeSlots = cardData.timeSlots.map(ts => {
        if (ts.id === timeslot.id) {
          return {
            ...ts,
            time: timeslot.time
          };
        }
        return ts;
      });

      await updateDoc(cardRef, { timeSlots: updatedTimeSlots });
      console.log("Erflogreich Timeslot umbenannt.")
    } catch (error) {
      console.error('Fehler beim Umbennen des Timeslots:', error);
    }
  }

  async deleteTimeslot(card: ICard, timeslot: ITimeSlot){
    try {
      const cardRef = doc(this.firestore, 'cards', card.id.toString());
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        console.error("Karte existiert nicht in Firestore");
        return;
      }

      const cardData = cardSnap.data() as ICard;

      const updatedTimeSlots = cardData.timeSlots.filter(ts => ts.id !== timeslot.id);

      await updateDoc(cardRef, { timeSlots: updatedTimeSlots });
      console.log(`Erflogreich Timeslot ${timeslot.time} gelöscht.`)
    } catch (error) {
      console.error('Fehler beim Löschen des Timeslots:', error);
    }
  }

  async addUser(card: ICard, timeslot: ITimeSlot, user: IUser){
    try {
      const cardRef = doc(this.firestore, 'cards', card.id.toString());
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        console.error("Card existiert nicht in Firestore");
        return;
      }

      const cardData = cardSnap.data() as ICard;

      // === Timeslot updaten ===
      const updatedTimeSlots = cardData.timeSlots.map(ts => {
        if (ts.id === timeslot.id) {
          return {
            ...ts,
            userIDs: [...ts.userIDs, user.id]
          };
        }
        return ts;
      });

      await updateDoc(cardRef, { timeSlots: updatedTimeSlots });

      console.log(`User ${user.firstname} erfolgreich hinzugefügt.`);
    } catch (error) {
      console.error('Fehler beim Erstellen des Users:', error);
    }
  }

  async removeUser(card: ICard, timeslot: ITimeSlot, user: IUser){
    try {
      const cardRef = doc(this.firestore, 'cards', card.id.toString());
      const cardSnap = await getDoc(cardRef);

      if (!cardSnap.exists()) {
        console.error("Karte existiert nicht in Firestore");
        return;
      }

      const cardData = cardSnap.data() as ICard;

      // === Timeslot updaten ===
      const updatedTimeSlots = cardData.timeSlots.map(ts => {
        if (ts.id === timeslot.id) {
          return {
            ...ts,
            userIDs: ts.userIDs.filter( id => id !== user.id)
          };
        }
        return ts;
      });

      await updateDoc(cardRef, { timeSlots: updatedTimeSlots });

      console.log(`User ${user.firstname} erfolgreich gelöscht.`);
    } catch (error) {
      console.error('Fehler beim Erstellen des Users:', error);
    }
  }
}
