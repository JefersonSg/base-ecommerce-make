import mongoose from '../conn';

const { Schema } = mongoose;

const SubcategoryModel = mongoose.model(
  'subcategory',
  new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: true
    },
    image: {
      type: String,
      required: true
    }
  })
);

export default SubcategoryModel;
