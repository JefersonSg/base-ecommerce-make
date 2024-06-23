import mongoose from 'mongoose';

export default function testeID(id: string) {
  const ObjectId = mongoose.Types.ObjectId;

  return ObjectId.isValid(id);
}
