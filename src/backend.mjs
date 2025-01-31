import PocketBase from 'pocketbase';
const db = new PocketBase('http://127.0.0.1:8090');

export async function getOffres() {
    try {
        let tableau_maisons = await db.collection('maison').getFullList({
            sort: '-created',
        });
        tableau_maisons = tableau_maisons.map((maison) => {
            maison.imgUrl = db.files.getURL(maison, maison.image);
            return maison;
        });
        return tableau_maisons;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des maisons', error);
        return [];
    }
}