import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const users = getCollectionFn("users");
export const products = getCollectionFn("products");
export const clinics = getCollectionFn("clinics");
export const clinicsSpecialisations = getCollectionFn("clinicsSpecialisations")
export const posts = getCollectionFn("posts");
export const cards  = getCollectionFn("cards");
export const appointments = getCollectionFn("appointments");
