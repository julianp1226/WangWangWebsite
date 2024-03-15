import { clinicsSpecialisations } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

import {
    validId,
    validStr,
    validImageUrl,
    validClinicStatus
  } from "../validation.js";

const createClinicSpecialisation = async (specialisation, imageUrl, status="active") => {
    try {
        specialisation = validStr(specialisation, "Specialization")
        if (!imageUrl) {
          imageUrl = "/public/images/No_Image_Available.jpg";
        } else {
          imageUrl = validImageUrl(imageUrl);
        }
        status = validClinicStatus(status)
    } catch(e){
        throw e
    }

    let newClinicSpecialisation = {
        specialisation: specialisation,
        imageUrl: imageUrl,
        status: status,
        insertDate: Math.round(new Date() / 1000)
    }

    const specialisationCollection = await clinicsSpecialisations();
    const insertInfo = await specialisationCollection.insertOne(newClinicSpecialisation);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add clinic specialisation";

    const newId = insertInfo.insertedId.toString();

    const clinicsSpecialisation = await getClinicSpecialisationById(newId);
    return clinicsSpecialisation;
};

const getClinicSpecialisationById = async (id) => {
    try {
        id = validId(id, "clinicSpecialisationId");
      } catch (e) {
        throw "Error in data/clinicsSpecialisation.js; getClinicSpecialisationById(id)):" + e;
      }
    
      const specialisationCollection = await clinicsSpecialisations();
      const clinicSpecialisation = await specialisationCollection.findOne({ _id: new ObjectId(id) });
    
      if (clinicSpecialisation === null)
        throw "Error data/clinicsSpecialisation.js; getClinicSpecialisationById(id)): Clinic specialistion not found";
    
        clinicSpecialisation._id = clinicSpecialisation._id.toString();
      return clinicSpecialisation;
}

const getClinicSpecialisation = async (specialisation) => {
    try {
        specialisation = validStr(specialisation, "specialisation");
      } catch (e) {
        throw "Error in data/clinicsSpecialisation.js; getClinicSpecialisation(specialisation)):" + e;
      }
    
      const specialisationCollection = await clinicsSpecialisations();
      const clinicSpecialisation = await specialisationCollection.findOne({specialisation: specialisation });
    
      if (clinicSpecialisation === null)
        throw "Error in data/clinicsSpecialisation.js; getClinicSpecialisation(specialisation)): Clinic specialistion not found";
    
        clinicSpecialisation._id = clinicSpecialisation._id.toString();
      return clinicSpecialisation;
}

const updateClinicSpecialisation = async (id, specialisation, imageUrl, status="active") => {
  try {
    id = validId(id)
    specialisation = validStr(specialisation, "Specialization")
    if (!imageUrl) {
      imageUrl = "/public/images/No_Image_Available.jpg";
    } else {
      imageUrl = validImageUrl(imageUrl);
    }
    status = validClinicStatus(status)
  } catch(e){
      throw "Error in data/clinicsSpecialisation.js; updateClinicSpecialisation()):" + e;

  }

  let updatedSpecialisation = {
    specialisation: specialisation,
    imageUrl: imageUrl,
    status: status
  }

  const specialisationCollection = await clinicsSpecialisations();
  const updateInfo = await specialisationCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedSpecialisation },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0) throw "Error: Update failed";

  let final = await updateInfo.value;
  final._id = final._id.toString();
  return final;
}

export {
    createClinicSpecialisation,
    getClinicSpecialisationById,
    getClinicSpecialisation,
    updateClinicSpecialisation
};