import PocketBase from 'pocketbase';
const db = new PocketBase('http://127.0.0.1:8090');

export async function getOffres() {
    try {
        let data = await db.collection('maison').getFullList({
            sort: '-created',
        });
        data = data.map((event) => {
            event.imgUrl = db.files.getURL(event, event.image);
            return event;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue dans la liste des maison', error);
        return [];
    }
}

//backend.mjs
export async function getOffre(id) {
    try {
        let data = await db.collection('maison').getOne(id);
        data.imageUrl = db.files.getURL(data, data.image);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la maison', error);
        return null;
    }
}

export async function bySurface(surfMin) {
    let records = await db.collection('Maison').getFullList({ filter: `surface > '${surfMin}'` })
    records = records.map((maison) => {
        maison.imgURL = db.files.getURL(maison, maison.images);
        return maison;
    })
    return records;
}

export async function byPrice(priceMax) {
    let records = await db.collection('Maison').getFullList({ filter: `prix < '${priceMax}'` })
    records = records.map((maison) => {
        maison.imgURL = db.files.getURL(maison, maison.images);
        return maison;
    })
    return records;
}

export async function byPriceForked(min, max) {
    let records = await db.collection('Maison').getFullList({ filter: `'${min}' < prix < '${max}'` })
    records = records.map((maison) => {
        maison.imgURL = db.files.getURL(maison, maison.images);
        return maison;
    })
    return records;
}

export async function addOffre(house) {
    try {
        await db.collection('maison').create(house);
        return {
            success: true,
            message: 'Offre ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant la maison', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant la maison'
        };
    }
}

export async function filterByPrix(prixMin, prixMax) {
    try {
        let data = await db.collection('maison').getFullList({
            sort: '-created',
            filter: `prix >= ${prixMin} && prix <= ${prixMax}`
        });
        data = data.map((maison) => {
            maison.imgUrl = db.files.getURL(maison, maison.image);
            return maison;
        });

        return data;
    } catch (error) {
        console.log('Une erreur est survenue en filtrant la liste des maisons', error);
        return [];
    }
}

// Récupérer la liste des agents
export async function getAgents() {
    try {
        let agents = await db.collection('agent').getFullList({
            sort: 'created', // ou un autre champ de tri, par exemple 'name'
        });
        return agents;
    } catch (error) {
        console.log("Une erreur est survenue lors de la récupération des agents", error);
        return [];
    }
}

// Récupérer les offres d'un agent
export async function getOffersByAgent(agentId) {
    try {
        let offers = await db.collection('maison').getFullList({
            sort: '-created',
            filter: `agent = "${agentId}"` // assure-toi que le champ 'agent' dans la collection 'maison' contient l'ID de l'agent
        });
        offers = offers.map((maison) => {
            maison.imgUrl = db.files.getURL(maison, maison.image);
            return maison;
        });
        return offers;
    } catch (error) {
        console.log("Une erreur est survenue lors de la récupération des offres pour l'agent", error);
        return [];
    }
}

export async function setFavori(house) {
    await db.collection('maison').update(house.id, { favori: !house.favori });
}